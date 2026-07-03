# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
make preview                                     # dev server with drafts and auto-reload
make                                             # build to public/
make check                                       # clean build (removes public/ first)
make bootstrap                                   # first-time setup: installs Hugo, git submodules
```

## Architecture

Hugo static site at `https://jauu.net/`. Personal technical blog by Hagen Paul Pfeifer.

### Themes

Two themes in `themes/`:
- `PaperMod/` — upstream, git submodule, do not edit
- `PaperModHgn/` — local fork with site-specific layouts, edit this one

Hugo merges them; `PaperModHgn` wins on any matching template path. Custom CSS goes in `assets/css/extended/custom.css`. The homepage (`layouts/index.html`) is a standalone override outside both themes.

### Posts

Leaf bundle format: `content/posts/YYYY-MM-DD-slug/index.md`. Images, PDFs, and other assets go in the same directory, referenced by relative path.

```bash
hugo new posts/YYYY-MM-DD-my-title/index.md
```

Frontmatter reference:

```yaml
title: "Post Title"
date: 2026-05-07T21:15:00+02:00
description: "One-line summary for listings and Open Graph."
draft: false
tags:
  - linux
hideSummary: false
editPost:
  URL: "https://github.com/hgn/jauu-net/tree/main/content/"
  Text: Suggest Changes
  appendFilePath: true
```

`draft: true` posts only show with `--buildDrafts`. `enableGitInfo: true` in `config.yml` pulls `.Lastmod` from git history, so commit content changes for accurate dates. Multilingual pages use `filename.en.md` / `filename.de.md` suffixes; the site is English.

### Site structure

| URL | Source |
|---|---|
| `/` | `layouts/index.html` |
| `/archives` | `content/archives.*.md` |
| `/about` | `content/about.html` |
| `/talks` | `content/talks.html` |
| `/linux-analyse/` | `content/linux-analyse/` |
| `/tags/` | auto-generated |

### Writing style

Direct technical prose for an experienced audience. No hand-holding, no hype. Run `/deai <path>` on any new post before publishing to strip AI-typical phrasing.
