---
title: "Dissecting Binaries: How Functions Begin"
date: 2026-07-04T10:30:00+02:00
description: "A quarter of every function on my Linux system begins with the same two-and-a-bit instructions, and none of them are the prologue you learned in school. I disassembled all 2,749 binaries to see what a function actually looks like when it starts."
draft: false
tags:
  - linux
  - reverse-engineering
  - security
  - machine-code-analyzer
series:
  - Dissecting Binaries with machine-code-analyzer
categories:
  - Linux
ShowToc: true
TocOpen: false
hideSummary: false
editPost:
  URL: "https://github.com/hgn/jauu-net/tree/main/content/"
  Text: Suggest Changes
  appendFilePath: true
---

*This is one of [Dissecting Binaries with machine-code-analyzer](/tags/machine-code-analyzer/), a series where I point the tool at real binaries and write up what falls out.*

Every text on x86 assembly teaches the same function prologue:

```asm
push %rbp
mov  %rsp, %rbp
```

Save the old frame pointer, point it at the current stack top, and now you
have a stable base to address locals and walk the stack. It is in every
textbook, every course, every disassembly screenshot from 2010.

I recently disassembled every executable on my Linux machine, all 2,749 of
them, and counted how each function begins. The prologue above barely shows
up. What functions actually start with today is something else, and one
pattern alone accounts for a quarter of them.

## Counting First Instructions

The method is blunt. For every function I could resolve a symbol for, I took
the first three instruction mnemonics and treated that triple as a signature.
Then I summed the signatures across the whole system. That gives 157,397
functions with a recognizable prologue and 998 distinct three-instruction
openings.

The distribution is not flat. It is dominated by a very small number of
patterns.

{{< figure src="prologues.png" alt="The most common function prologues across a whole Linux system" caption="The most common three-instruction function prologues, summed over every binary on the system. Two patterns cover almost half of all functions." >}}

The winner, at 27% of all functions, is this:

```asm
endbr64
push %r12
push %rbp
```

The runner-up, another 19%, is `endbr64 ; push ; mov`. Together, two openings
account for nearly half of every function on the system. And 95% of all
functions, whatever comes next, begin with the same single instruction:
`endbr64`.

That is the headline. Not the frame-pointer setup from the textbook. A CET
barrier followed by register pushes.

## What endbr64 Is Doing There

`endbr64` is not arithmetic, not data movement, not a jump. On a CPU without
Intel CET it does nothing at all, a four-byte no-op. On a CPU with CET's
Indirect Branch Tracking enabled, it is a landing pad: an indirect call or
jump is only allowed to arrive at an address that holds an `endbr64`. Land
anywhere else and the processor faults.

This is a mitigation against a whole class of exploits. Return-oriented and
jump-oriented programming works by chaining together snippets that end in
indirect branches, jumping into the middle of existing code. If every legal
indirect target must be marked with `endbr64`, the attacker can no longer
aim at arbitrary bytes.

Compilers emit it under `-fcf-protection`, and the major distributions turn
that on by default now. So the compiler drops an `endbr64` at the start of
any function that might be reached through a pointer, which in practice is
almost all of them. That is why 95% of the functions on my system open with
an instruction that did not exist as a default a few years ago.

## Where the Frame Pointer Went

So where is `push %rbp ; mov %rsp,%rbp`? It is mostly gone, and for a
separate reason.

At `-O2`, compilers omit the frame pointer. `rbp` is no longer reserved as a
stack base; it becomes just another general-purpose register the function can
use for whatever it likes. That frees up a register, which is worth having,
at the cost of making stack unwinding rely on DWARF metadata instead of a
simple `rbp` chain. (That trade-off is exactly the ongoing argument about
`-fno-omit-frame-pointer` and whether profilers should get their easy
unwinding back. In my corpus, frame pointers are kept in about 5% of
binaries; the rest omit them.)

Once `rbp` is a normal register, it shows up in the prologue for a mundane
reason: the System V ABI makes `rbp`, `rbx` and `r12`-`r15` callee-saved. A
function that wants to use them has to preserve the caller's values first, so
it pushes them. That is the `push %r12 ; push %rbp` you see: not a stack
frame, just a function saving the registers it is about to clobber.

Put together, the modern prologue is two jobs the textbook never mentioned:
mark this function as a legal indirect-branch target, then save the
callee-saved registers it plans to use.

## Seeing It in the Wild

Pick any function out of `python3` and it is right there:

```asm
0000000000422a4e <Py_SetProgramName>:
  422a4e: endbr64
  422a52: push   %r12
  422a54: push   %rbp
```

`endbr64`, then two pushes. This is the 27% pattern, in a real binary, doing
exactly what the aggregate says: announce a landing pad, save two registers,
get to work.

## The Caveats

The count is honest about its limits. On stripped binaries I only see the
functions that survive in the dynamic symbol table, the exported ones, so the
static helpers are invisible and do not vote. And a three-instruction
signature is coarse: `endbr64 ; push ; push` lumps together every function
that saves two registers, regardless of which. Neither changes the shape of
the result. The `endbr64` at the front is unmissable, and the frame-pointer
prologue really has faded to a rounding error.

None of this is new to a compiler engineer. But it is a concrete answer to a
question most of us never actually check: what does a function look like when
it starts, on the machine in front of you, right now? Not what the textbook
says. A security checkpoint and a register save.

This is the first of a few posts pulling findings out of that
whole-system disassembly. The tool that produced the numbers,
[machine-code-analyzer](https://jauu.net), is a separate write-up.
