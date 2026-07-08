---
title: "Dissecting Binaries: The Six Layers of a Hardened Binary"
date: 2026-07-07T21:15:00+02:00
description: "The same C file, compiled twice: once with the hardening flags off, once with them on. Six mitigations separate the two binaries, and each one shows up in the machine code if you know where to look."
draft: false
tags:
  - linux
  - security
  - reverse-engineering
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

A modern binary defends itself in layers. None of the layers is a wall.
Each one takes a single technique out of an attacker's toolbox. It is the
stack of them, and the way they interlock, that makes an exploit
expensive to write.

The clearest way to see the layers is to remove them. Here is a small
program with an indirect call through a function pointer and a stack
buffer, the two things most of the mitigations care about:

```c
static void greet(const char *name) { printf("hello, %s\n", name); }
static void shout(const char *name) { printf("HELLO, %s\n", name); }

typedef void (*handler)(const char *);

int main(int argc, char **argv)
{
	handler table[] = { greet, shout };
	char buf[64];

	strcpy(buf, argc > 1 ? argv[1] : "world");
	handler h = table[argc & 1];   /* target reached through a pointer */
	h(buf);                        /* the indirect call */
	return 0;
}
```

I compiled it twice. Once with every mitigation switched off:

```console
$ gcc -O2 -fcf-protection=none -fno-stack-protector -no-pie \
      -Wl,-z,norelro hardening-demo.c -o demo-weak
```

and once with the flags a distribution build uses:

```console
$ gcc -O2 -fcf-protection=full -fstack-protector-strong -fPIE -pie \
      -Wl,-z,relro,-z,now -D_FORTIFY_SOURCE=2 hardening-demo.c -o demo-hard
```

Same source, same compiler. The two binaries are not the same program at
the machine level at all. Here is the mitigation status of each, read
straight out of the ELF file and the disassembly by the `hardening`
module of my analyzer:

<style>
.checksec .on   { color: #4fb39f; font-weight: 700; }
.checksec .off  { color: #e06666; font-weight: 700; }
.checksec .part { color: #e0932f; font-weight: 700; }
.checksec table { font-size: 0.95em; }
</style>

<div class="checksec">

| Layer | `demo-weak` | `demo-hard` |
| :-- | :-- | :-- |
| PIE / ASLR | <span class="off">✗</span> fixed load address | <span class="on">✓</span> position independent |
| NX | <span class="on">✓</span> non-executable | <span class="on">✓</span> non-executable |
| RELRO | <span class="off">✗</span> none | <span class="on">✓</span> full, GOT read-only |
| Stack Canary | <span class="off">✗</span> no protector | <span class="on">✓</span> 1 function guarded |
| CET / IBT | <span class="off">✗</span> `endbr64` on 0% | <span class="on">✓</span> `endbr64` on 100% |
| FORTIFY | <span class="off">✗</span> not used | <span class="on">✓</span> `_chk` wrappers |

</div>

One build has a single layer standing, NX, which is on by default. The
other has all six. Let me walk the rows, what each layer stops and how to
spot it in the binary.

## 1. PIE and ASLR

The oldest trick in memory corruption is knowing where things are. If the
code and data of a program sit at fixed addresses every time it runs, an
attacker can hardcode them. Position Independent Executables let the
loader place the whole image at a random base, and Address Space Layout
Randomization picks a fresh base on every launch. Now the addresses an
exploit needs are a moving target.

You see it in the ELF type. A non-PIE executable is `ET_EXEC` and loads
at a fixed address; a PIE is an `ET_DYN` shared object with an
interpreter, so the loader is free to slide it:

```console
$ file demo-weak
ELF 64-bit LSB executable, ... not stripped
$ file demo-hard
ELF 64-bit LSB pie executable, ...
```

`rabin2 -I` from the radare2 suite calls the same thing `pic`:
`false` for the weak build, `true` for the hardened one.

## 2. NX, the Non-Executable Stack

Classic shellcode injection writes machine code into a stack buffer and
jumps to it. The No-eXecute bit ends that: the stack and heap are mapped
without execute permission, so bytes sitting there are data, never code.
This is what pushed attackers from injecting code to reusing the code
already in the binary, which is why the later layers are all about
controlling reused code.

It lives in the `GNU_STACK` program header, whose flags say whether the
stack is executable:

```console
$ eu-readelf -l demo-hard | grep GNU_STACK
  GNU_STACK  0x0 0x0 0x0 0x0 0x0 RW 0x10
```

`RW`, not `RWE`: readable, writable, not executable. This one is on by
default now, in both my builds. You have to go out of your way with
`-z execstack` to turn it off, and a binary that has one is worth a hard
look.

## 3. RELRO

When a program calls into a shared library, the address is resolved
through a table of pointers, the GOT. If that table stays writable, an
overflow that reaches it can swap a resolved pointer and redirect a call
to anywhere. RELRO closes that. Full RELRO resolves every import eagerly
at startup (that is the `BIND_NOW` part) and then maps the table
read-only, so a later write faults.

{{< figure src="schema-relro.png" alt="Partial versus full RELRO" caption="Partial RELRO leaves the GOT writable. Full RELRO resolves everything at startup and then makes it read-only." >}}

Partial RELRO (the default from just linking) protects some sections but
leaves the `.got.plt` writable. Full RELRO needs the `now` linker flag.
The two states are visible in the dynamic section:

```console
$ eu-readelf -l demo-hard | grep RELRO
  GNU_RELRO  0x2da8 ... R 0x1
$ eu-readelf -d demo-hard | grep -E 'BIND_NOW|FLAGS_1'
  FLAGS      BIND_NOW
  FLAGS_1    NOW
```

The weak build has no `GNU_RELRO` segment at all, so `rabin2` reports
`relro no`; the hardened build reports `relro full`.

## 4. The Stack Canary

A linear buffer overflow writes from a local buffer upward, toward the
saved registers and the return address. The stack protector puts a random
value, the canary, between the buffers and the return address, and checks
it just before the function returns. Overwrite the return address and you
have overwritten the canary first; the check fails and the program aborts
in `__stack_chk_fail` instead of returning into attacker data.

{{< figure src="schema-stack-canary.png" alt="Stack layout with a canary between the buffer and the return address" caption="The canary sits between the buffers and the return address. A linear overflow has to destroy it on the way, and ret notices." >}}

The compiler only spends a canary on functions that actually have a stack
buffer, so coverage is never total. In the machine code it is a load from
the thread control block at `%fs:0x28` at entry and a compare before the
return. My analyzer counts those: zero functions in `demo-weak`, and in
`demo-hard` exactly one, `main`, the only function here with a buffer.

## 5. CET and Indirect Branch Tracking

Once the stack is non-executable and the return address is guarded,
attackers turn to indirect branches, calls and jumps through a register
or a pointer, and aim them at useful fragments of existing code. Intel
CET's Indirect Branch Tracking answers this at the hardware level. Every
legal target of an indirect branch must begin with an `endbr64`
instruction. Land an indirect call or jump anywhere else and the CPU
raises a control-protection fault.

{{< figure src="schema-cet.png" alt="An indirect call may only land on an endbr64" caption="The indirect call may only land on an endbr64. Any other target, like the middle of a function, faults." >}}

Our program has exactly the construct this protects, an indirect call
through the pointer table:

```asm
call *(%rsp,%rbx,8)
```

Its targets are `greet` and `shout`. In the hardened build they each open
with the landing pad; in the weak build they do not:

```asm
# demo-weak, greet():        # demo-hard, greet():
mov    %rdi,%rsi             endbr64
xor    %eax,%eax             mov    %rdi,%rdx
```

That one four-byte instruction is the difference between "this address is
a valid call target" and "the CPU will fault if you branch here". At the
scale of a whole binary it is the single most common opening instruction
on a modern system, which I [wrote about separately](/posts/2026-07-04-standard-function-prologue/).

## 6. FORTIFY

The last layer moves up to the source level. With `_FORTIFY_SOURCE` the
compiler, when it can see the size of a destination buffer, replaces
unbounded library calls with checked variants that know that size and
abort on an overflow. The substitution is visible in the call targets. In
the weak build the `strcpy` is a plain call:

```asm
call strcpy@plt
```

In the hardened build the same line became:

```asm
call __strcpy_chk@plt
```

`__strcpy_chk` gets the size of `buf` as an extra argument and traps if
the copy would run past it. Grep a binary's imported symbols for names
ending in `_chk` and you know FORTIFY was in effect.

## A Note on RUNPATH

There is a seventh thing the card checks, and it is the one where the good
state is *off*. A `RUNPATH` is a library search path baked into the
binary. If it points at a directory an attacker can write to, it is a
library hijack waiting to happen. A clean binary has none, and the tool
flags one in red when it finds it.

## Reading It Back

None of this needs source or symbols. Every layer leaves a mark in the
ELF headers or the instruction stream: the ELF type for PIE, a program
header for NX and RELRO, a `%fs:0x28` load for the canary, an `endbr64`
for CET, a `_chk` import for FORTIFY. The `hardening` card is just those
six checks collected into one picture, and the point of the picture is
that real binaries are rarely all green.

The interpreter on my own machine makes the point:

<div class="checksec">

| Layer | `/usr/bin/python3` |
| :-- | :-- |
| PIE / ASLR | <span class="off">✗</span> no, fixed load address |
| NX | <span class="on">✓</span> non-executable |
| RELRO | <span class="part">~</span> partial, GOT still writable |
| Stack Canary | <span class="on">✓</span> 4 functions guarded |
| CET / IBT | <span class="on">✓</span> `endbr64` on 97% |
| FORTIFY | <span class="on">✓</span> `_chk` wrappers present |

</div>

CET covers 97% of its functions, NX and the stack protector are on, but
it is a fixed-address `ET_EXEC` with only partial RELRO. Not a scandal,
just a build that predates some of the defaults, and exactly the kind of
thing worth noticing.

## Conclusion

The six layers are not independent walls, they are a chain, and that is
the point. NX forces an attacker off the stack and into reusing existing
code. PIE hides where that code is. The canary and RELRO guard the two
classic ways to seize a return address or a call pointer. CET restricts
where an indirect branch may land at all. FORTIFY stops a class of
overflows before they start. Defeating a hardened binary means defeating
several of these at once, and modern toolchains turn most of them on by
default, so the baseline is high without anyone thinking about it.

The value of looking is that "most" is not "all". Same source can become
two very different binaries, and the binary in front of you may be missing
a layer you assumed was there. It only takes a minute to check.
