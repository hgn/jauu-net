---
title: "Opening Up My Git Training Material"
date: 2026-05-07T21:15:00+02:00
description: "A 300-page Git training curriculum, built over years of professional training, released under CC BY-NC-ND 4.0."
draft: false
tags:
  - git
  - training
hideSummary: false
editPost:
  URL: "https://github.com/hgn/jauu-net/tree/main/content/"
  Text: Suggest Changes
  appendFilePath: true
---

I started teaching Git back when the porcelain was thin and most workflows required you to understand what was happening underneath. Over the years the material grew into something close to a full curriculum: fundamentals, branching and merging, rebasing, hooks, submodules, subtrees, LFS. Around 300 pages total.

I no longer run these trainings myself, but the content is still in use in professional settings. Releasing it under an open license seems like the right call at this point.

[**Download: git-course.pdf**](git-course.pdf)

License: [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

## Contents

### 00 — Git Introduction

- Background and history; why Linus wrote it
- Who uses Git
- Design goals: speed, distributed operation, data integrity
- Documentation, CLI tooling, and GUI clients

### 01 — Git 101

- Identity configuration
- Creating the first repository
- Working stages: workspace, index, repository
- First commit and commit message conventions
- `git status` and the repository log
- Git object model: blobs, trees, commits
- *Practical Session I*

### 02 — Understanding Git

- Commit IDs: SHA1, hash properties, abbreviated hashes
- Cloning: local clones, HTTPS and SSH protocols, disk layout
- Branching: create, switch, HEAD, delete, branch origin
- Differences: `git diff`, two-dot vs. three-dot ranges, external diff tools
- Commit history: log formatting, filtering, branch-specific ranges
- Merging: fast-forward, merge commits, conflict resolution, binary files, merge strategies
- Rebasing: motivation, relocating branches, under the hood, conflict resolution
- Cherry-pick
- Git aliases
- `git bisect`: manual and automated

### 03 — Working in Teams

- Distributed workflow and server infrastructure
- Remote repositories: fetch, push, pull, upstream branches
- Tracking branches
- Repository safety
- Development models: centralized, garage project workflow, enterprise workflow
- *Practical Session II*
- Undoing things and the reflog
- Staging partial changes with `git add -p`
- Ignoring files: `.gitignore`, directory-scoped rules
- Submodules: concepts, howto, cloning, updating, cheat sheet
- Subtrees
- Git stash
- Interactive rebase: reword, edit, squash, drop
- Searching: `git grep`, `git blame`
- Revision syntax: `HEAD~N`, `@{yesterday}`, `git describe`, `git rev-parse`
- Tags: reference tags, annotated tags, GnuPG-signed tags
- `git archive`: exporting a repository snapshot
- Repository and branch naming conventions

### 04 — Limitations and Scale

- Large repositories: performance characteristics, Microsoft Windows case study
- Git LFS: setup, tracking patterns, exclusive locks, internal mechanics, migration
- VFS for Git
- Repository health: `git fsck`, corruption recovery for packed and unpacked objects
- Garbage collection: `git gc`
- Language bindings and libgit2
- Email-based workflow: `git format-patch`, `git send-email`, `git am`, Linux kernel example
- Switching to Git: rules of thumb, repository restructuring advice
