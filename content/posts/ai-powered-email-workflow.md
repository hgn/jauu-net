---
title: "Ai Powered Email Workflow"
description: ""
date: 2025-09-24T22:34:56+02:00
draft: false
tags: ["email", "linux", "notmuch", "chatgpt", "ai", "llm", "mutt", "neomutt"]
toc: false
editPost:
    URL: "https://github.com/hgn/jauu-net/tree/main/content/"
    Text: "Suggest Changes"
    appendFilePath: true
hideSummary: false
images: "images/open-graph-default.png"
ShowRssButtonInSectionTermList: true
---

Background: when you’re subscribed to multiple mailing lists like the Linux
Kernel Mailing List (lkml), bpf, dwarves, io-uring, linux-embedded, and others,
the daily flood of emails makes it impossible to read everything in detail.
Still, I want to keep up with ongoing development. That’s why I built a
**ChatGPT Summary Generator** that integrates nicely with my
OfflineIMAP–NeoMutt–Notmuch setup.

> Sorry for the clickbait title — it’s really just an email-to-ChatGPT fanout. ;-)


# Email Base Setup

To understand my AI setup, let’s first look at my baseline email stack. It
deviates a bit from the "standard Gmail" web GUI setup: it’s more CLI-focused,
supports sending automated emails, includes cross-provider backups, and is
optimized for handling very high mail volumes. It consists of the following
components:

To understand my AI setup, let’s first look at my baseline email stack. It
consists of the following components:

- **NeoMutt** as my MUA (Mail User Agent)
- **OfflineIMAP**; an IMAP↔Maildir bidirectional syncer
- **Notmuch**; an offline search and tagging engine


## NeoMutt

I use NeoMutt in two modes:  
- `mutt` in an online IMAP mode  
- `mutt-offline` in an offline mode that works directly on my `~/.mail` Maildir  

Emails are always sent via SMTP. If messages are deleted locally in offline
mode, the deletion is later synced back to the IMAP server.


## OfflineIMAP

OfflineIMAP handles synchronization in both directions. My configuration is
basically standard — nothing fancy here.


## Notmuch

Notmuch is where things get interesting. It’s a **thread-based email index,
search, and tagging application**. It’s designed to be blazing fast, even with
gigabytes of data. My mail currently spans ~14 GiB, yet searches through the
Notmuch index return results instantly.

In a global script called `email-sync`, I first run OfflineIMAP to sync new
mail, then trigger Notmuch to index it. Now I can search by recipient, subject,
date, or complex keyword combinations across all folders in fractions of a
second.

But Notmuch is more than search — I also use it heavily for **tagging**.  
- Mailing lists are tagged at import (e.g. `lkml`).  
- Subtopics are refined (e.g. all eBPF-related discussions get `lkml-bpf`).  
This lets me view all eBPF-related emails at once without crafting complicated
search queries.

Here are some typical searches:

- **Find all mail from Linus Torvalds:** `notmuch search from:"Linus Torvalds"`
- **Find all emails mentioning BPF:** `notmuch search BPF`
- **Filter by date (Sept 1–10, 2025):** `notmuch search date:2025-09-01..2025-09-10`
- **Unread messages in INBOX:** `notmuch search tag:inbox and tag:unread`
- **Find patches with subject starting `[PATCH v3]`:** `notmuch search subject:"[PATCH v3]"`
- **All emails from netdev in last 48h:** `notmuch search tag:netdev and date:48hours..`
- **Find mails with both `sched` and `latency`:** `notmuch search sched and latency`
- **Exclude noisy bots:** `notmuch search tag:lkml and not from:"kernel test robot"`
- **Virtual Mailbox (NeoMutt magic):** `virtual-mailboxes "eBPF Threads" "notmuch://?query=tag:lkml and tag:ebpf"`
- **Purge tagged for deletion:** `notmuch search --output=files tag:delete | xargs rm`

I also use Notmuch for **hygiene**:  
- Mails are tagged for deletion after a pre-defined time (3 months), at thread
  level, so that threads over 3 months are not splitted apart.
- Others (e.g. tagged with `ebpf`) are preserved longer.  
This multi-step tagging lets me define exactly what to keep, what to discard,
and when. Afterwards, deletions are synced back to IMAP.  

The one exception is the **INBOX**, where everything else lands. That I sort
manually, without heuristics.

Another killer feature: NeoMutt supports **virtual mailboxes**. I can view,
say, all `lkml-bpf` tagged emails as if they were a real folder. Super handy!


# AI Summary

With hundreds of emails arriving each day, skimming them all in the evening is
unrealistic. Notmuch tagging helps, but only so much.

To cope, I wrote a small script using LLMs. It doesn’t reply to emails — it
**summarizes threads**. All messages in a thread are clustered together, then
sent to ChatGPT for analysis.

Beyond content summaries, I added two key features:  

1. **Action Detection**  
   - If an email contains a direct request or task assigned to me, it gets
     flagged explicitly.  

2. **Criticality Rating**  
   - If I’m directly addressed (“pinged”) or if timing is critical, the summary
     highlights this with a “high” criticality rating (visually colored for
     emphasis).  


# Execution - Results

Running the setup is straightforward:


```
$ notmuch-summary.py --hours 4 --model gpt-4o-mini --tag linux-bpf
- Emails: 16
- Threads: 3
- Authors: 6
- Avg/Thread: 5.33
- Span: 2025-09-23 11:02  …  2025-09-24 22:23
- Top Authors: listout@listout.xyz (6), mehdi.benhadjkhelifa@gmail.com (3), alexei.starovoitov@gmail.com (3)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Date of last email: 34 minutes ago                 (2025-09-24 22:23)
Date of first email:  4 hours 33 minutes ago       (2025-09-24 18:23)
Subject line: [PATCH] selftests/bpf: Add -Wsign-compare C compilation flag
Conversation: "Mehdi Ben Hadj Khelifa" (2x), "vivek yadav" (1x)
Summary:
  Mehdi Ben Hadj Khelifa submitted a patch to improve sign comparison handling in
  BPF tests. Vivek Yadav suggests splitting the patch into 2-3 smaller parts to
  make review easier. Mehdi asks if he should send a new version of the patch (v3)
  and whether the changes should be split into multiple patches or a patch series.
Priority: high
Tasks for me:
- Check if the patch can be split into 2-3 parts.
Reply: mutt-offline -f /home/pfeifer/.mail/INBOX/ -e "push l~i529bdaaa-6ce9-4cc7-b764-c806138b1951@gmail.com\nr"
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Date:              1 hour ago                   (2025-09-24 21:57)
Subject line: [PATCH bpf-next v2] selftests/bpf: Add -Wsign-compare C compilation flag
Conversation: "Mehdi Ben Hadj Khelifa" (1x)
Summary:
  Mehdi Ben Hadj Khelifa submitted a patch for the BPF self-tests that adds the
  -Wsign-compare C compiler flag to ensure that the signs of comparisons match. The
  patch also fixes CI issues caused by missing .c and .h files. A total of 63 files
  were changed, with 109 new and 107 removed lines.
Priority: normal
Reply: mutt-offline -f /home/pfeifer/.mail/INBOX/ -e "push l~i20250924195731.6374-1-mehdi.benhadjkhelifa@gmail.com\nr"
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Date of last email: 2 hours 29 minutes ago       (2025-09-24 20:28)
Date of first email:  1 day 11 hours ago           (2025-09-23 11:02)
Subject line: [syzbot] [bpf?] general protection fault in print_reg_state
Conversation: "Brahmajit Das" (6x), "Alexei Starovoitov" (3x), "syzbot" (2x), "KaFai Wan" (1x)
Summary:
  The email conversation is about a general protection fault caused by a NULL pointer
  dereference error in the print_reg_state() function. Brahmajit Das proposed a patch
  to add explicit NULL checks to prevent crashes and improve the robustness of the
  BPF verifier. Alexei Starovoitov expressed concerns that the patch only addresses a
  symptom and doesn't fix the underlying problem.
Priority: high
Tasks for me:
- Review and possibly adapt the proposed patch from Brahmajit Das to fix the NULL
  pointer dereference issue.
- Analyze the feedback from Alexei Starovoitov and KaFai Wan to improve the patch.
Reply: mutt-offline -f /home/pfeifer/.mail/INBOX/ -e "push l~iwz6god46aom7lfyuvhju67w47czdznzflec3ilqs6f7fpyf3di@k5wliusgqlut\nr"
```

In `Summary` you will find the ChatGPT generated abstract for each
thread-cluster.

BTW: I added a line in this form  
`mutt-offline -f /home/pfeifer/.mail/INBOX/ -e push ...`.  

This makes it easy to respond to an email immediately. It opens NeoMutt with
the correct message already in **reply mode**, so I can answer right away
without having to search for the email first.  

Important: the original email is always included in full. In the end, you
still have to read the complete message carefully — the abstract alone is not
sufficient for writing an appropriate reply, nor is it meant to be.  

Below is the full script (just export you ChatGPT API key):

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import sys
import json
import argparse
import urllib.request
import shutil
import textwrap
import unicodedata
import subprocess
from datetime import datetime, timezone
from typing import Optional, List, Dict, Tuple
from collections import Counter
from email.parser import BytesParser
from email.policy import default as email_policy
from email.header import decode_header
from email.utils import parseaddr, parsedate_to_datetime
from email.message import Message

RESET="\033[0m"; BOLD="\033[1m"; DIM="\033[2m"; CYAN="\033[36m"
BRIGHT_WHITE="\033[97m"; BRIGHT_YELLOW="\033[93m"; RED="\033[31m"; GREY="\033[90m"

MAX_EMAILS_PER_CLUSTER=500
MAX_CHARS_PER_EMAIL=80000
MAX_CLUSTER_CHARS=600000

def env(n, d=None, req=False):
    v=os.environ.get(n,d)
    if req and not v: sys.stderr.write(f"ERROR: {n} not set\n"); sys.exit(2)
    return v

def decode_mime_header_value(v: Optional[str]) -> str:
    if not v: return ""
    parts=decode_header(v); out=[]
    for txt,enc in parts:
        if isinstance(txt,bytes):
            try: out.append(txt.decode(enc or "utf-8","replace"))
            except LookupError: out.append(txt.decode("utf-8","replace"))
        else: out.append(txt)
    return "".join(out).strip()

def parse_from(addr_hdr: Optional[str])->Tuple[str,str]:
    name, addr = parseaddr(addr_hdr or ""); name=decode_mime_header_value(name)
    return (name or ""), (addr or "")

def parse_date_header(date_hdr: Optional[str]) -> Optional[datetime]:
    if not date_hdr: return None
    try:
        dt=parsedate_to_datetime(date_hdr)
        if not dt: return None
        if dt.tzinfo is None: dt=dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception: return None

def truncate(s:str, lim:int)->str:
    return s if len(s)<=lim else s[:max(0,lim-20)]+"\n...[truncated]"

def sanitize_subject_ascii(s:str)->str:
    s=unicodedata.normalize("NFKD", s or "")
    s="".join(ch for ch in s if 32<=ord(ch)<=126)
    return re.sub(r"\s+"," ",s).strip()

def human_delta(dt:Optional[datetime], now=None)->str:
    if not dt: return "-"
    now = now or datetime.now(timezone.utc)
    secs=int((now-dt).total_seconds()); future=secs<0; secs=abs(secs)
    d,rem=divmod(secs,86400); h,rem=divmod(rem,3600); m,_=divmod(rem,60)
    parts=[]
    if d: parts.append(f"{d} Tag{'e' if d!=1 else ''}")
    if h: parts.append(f"{h} Stunde{'n' if h!=1 else ''}")
    if m and not d: parts.append(f"{m} Minute{'n' if m!=1 else ''}")
    if not parts: parts.append("weniger als 1 Minute")
    return ("in " if future else "vor ")+" ".join(parts)

def term_width()->int:
    try: return max(40, shutil.get_terminal_size(fallback=(100,20)).columns)
    except Exception: return 100

def separator_line()->str:
    return "─"*term_width()

def run_subprocess(cmd: List[str], input_text: Optional[str]=None) -> str:
    try:
        r = subprocess.run(cmd, check=True, text=True, capture_output=True, input=input_text)
        return r.stdout
    except FileNotFoundError:
        sys.stderr.write(f"ERROR: {cmd[0]} not found\n"); sys.exit(127)
    except subprocess.CalledProcessError as e:
        sys.stderr.write(e.stderr or f"ERROR running: {' '.join(cmd)}\n"); sys.exit(e.returncode or 1)

def lynx_html_to_text(html:str)->str:
    try:
        return run_subprocess(["lynx","-dump","-nolist","-stdin"], input_text=html)
    except SystemExit:
        return ""

def read_mail_body_from_file(path:str)->Tuple[str,str]:
    try:
        with open(path,"rb") as f:
            msg: Message = BytesParser(policy=email_policy).parse(f)
    except Exception:
        return ("","")
    plain_parts, html_parts = [], []
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_disposition()=="attachment": continue
            ctype = (part.get_content_type() or "").lower()
            if ctype=="text/plain":
                try: plain_parts.append(part.get_content())
                except Exception: pass
            elif ctype=="text/html":
                try: html_parts.append(part.get_content())
                except Exception: pass
    else:
        ctype=(msg.get_content_type() or "").lower()
        try:
            if ctype=="text/plain": plain_parts.append(msg.get_content())
            elif ctype=="text/html": html_parts.append(msg.get_content())
        except Exception: pass
    plain="\n".join([t for t in plain_parts if isinstance(t,str)]).strip()
    html ="\n".join([h for h in html_parts if isinstance(h,str)]).strip()
    return (plain, html)

def clean_subject_root(s:str)->str:
    if not s: return ""
    s = s.strip()
    rx = re.compile(r'^\s*(?:re|aw|wg|sv|fw|fwd|tr|rv|res|enc)(?:\[\d+\])?\s*[:：]\s*', re.IGNORECASE)
    prev=None
    while s and s!=prev and rx.match(s):
        prev=s
        s = rx.sub("", s)
    s = re.sub(r'^\s*\[\s*(?:EXTERNAL|SPAM|VIRUS|JUNK)\s*\]\s*','',s, flags=re.IGNORECASE)
    return s.strip()

def build_notmuch_query(folder: str, tag: Optional[str], raw_query: Optional[str], since_hours: int) -> str:
    base = (raw_query.strip() if raw_query else None)
    if not base:
        base = f"tag:{tag.strip()}" if tag else f"folder:{folder.strip()}"
    return f"{base} and date:{since_hours}hour.."

class EmailMessageLite:
    __slots__=("date_dt","date_str","from_name","from_email","subject","body","message_id")
    def __init__(self, date_dt:datetime, from_name:str, from_email:str, subject:str, body:str, message_id:str):
        self.date_dt=date_dt
        self.date_str=date_dt.astimezone().strftime("%Y-%m-%d %H:%M") if date_dt else ""
        self.from_name=from_name or ""
        self.from_email=from_email or ""
        self.subject=subject or ""
        self.body=body or ""
        self.message_id=message_id or ""

class Conversation:
    __slots__=("first_dt","last_dt","first_subject","names","messages","last_message_id")
    def __init__(self, first_dt:datetime, last_dt:datetime, first_subject:str, names:List[str], messages:List[EmailMessageLite], last_message_id:str):
        self.first_dt=first_dt; self.last_dt=last_dt
        self.first_subject=first_subject
        self.names=names
        self.messages=messages
        self.last_message_id=last_message_id or ""

class MailBackend:
    def fetch_conversations(self, query:str, max_threads:Optional[int]=None) -> List[Conversation]:
        raise NotImplementedError

class NotmuchBackend(MailBackend):
    def _json(self, s:str):
        try: return json.loads(s or "[]")
        except Exception: return []

    def _nm_threads(self, query:str)->List[str]:
        arr=self._json(run_subprocess(["notmuch","search","--format=json","--output=threads",query]))
        return [t for t in arr if isinstance(t,str)]

    def _nm_show_thread(self, tid:str):
        return self._json(run_subprocess(["notmuch","show","--entire-thread=true","--format=json",f"thread:{tid}"]))

    def _flatten_show(self, node, out:List[dict]):
        if isinstance(node, list):
            for n in node: self._flatten_show(n, out)
            return
        if not isinstance(node, dict): return
        h = node.get("headers") or {}
        fn = node.get("filename")
        path = fn[0] if isinstance(fn,list) and fn else (fn if isinstance(fn,str) else None)
        subj = decode_mime_header_value(h.get("Subject") or "")
        f_name,f_addr = parse_from(h.get("From"))
        dt = parse_date_header(h.get("Date"))
        mid = (node.get("id") or (h.get("Message-Id") or h.get("Message-ID") or "")).strip()
        body_text, body_html = ("","")
        if path:
            body_text, body_html = read_mail_body_from_file(path)
        content = lynx_html_to_text(body_html) if body_html else body_text
        out.append({
            "from_name": f_name, "from_email": f_addr,
            "subject": subj, "date_dt": dt, "content": content, "message_id": mid
        })
        if isinstance(node.get("replies"),list): self._flatten_show(node["replies"], out)
        if isinstance(node.get("content"),list): self._flatten_show(node["content"], out)

    def fetch_conversations(self, query:str, max_threads:Optional[int]=None) -> List[Conversation]:
        tids=self._nm_threads(query)
        if max_threads and len(tids)>max_threads: tids=tids[:max_threads]
        convs=[]
        for tid in tids:
            show=self._nm_show_thread(tid)
            flat=[]; self._flatten_show(show, flat)
            flat=[m for m in flat if m.get("date_dt") is not None]
            if not flat: continue
            flat.sort(key=lambda x: x["date_dt"])
            names=[]; msgs=[]; total=0
            first_dt=flat[0]["date_dt"]; last_dt=flat[-1]["date_dt"]
            first_subject=clean_subject_root(flat[0]["subject"] or "(no subject)")
            last_mid=flat[-1].get("message_id") or ""
            for m in flat[:MAX_EMAILS_PER_CLUSTER]:
                names.append(m.get("from_name") or m.get("from_email") or "(unknown)")
                body=truncate(m.get("content") or "", MAX_CHARS_PER_EMAIL)
                em=EmailMessageLite(m["date_dt"], m.get("from_name") or "", m.get("from_email") or "", m.get("subject") or "", body, m.get("message_id") or "")
                total += len(em.date_str)+len(em.from_name)+len(em.from_email)+len(em.subject)+len(em.body)
                if total>MAX_CLUSTER_CHARS: break
                msgs.append(em)
            if msgs:
                convs.append(Conversation(first_dt,last_dt,first_subject,names,msgs,last_mid))
        return convs

SYSTEM_PROMPT_JSON = """Du bekommst eine E-Mail-Konversation (chronologisch, älteste zuerst) als Liste von Objekten:
- date (lokal formatiert), from_name, from_email, subject, body.

Gib EIN JSON-Objekt mit GENAU diesen Feldern zurück:
{
  "summary": "<konkreter deutscher Absatz (1–3 Sätze), NICHT leer, keine Floskeln>",
  "tasks": ["<ToDo, das Hagen Pfeifer (hagen@jauu.net) betrifft>", ...],
  "priority": "normal" | "high"
}

Anforderungen an "summary":
- Muss 1–4 Sätze enthalten und inhaltlich konkret sein.
- Vermeide generische Phrasen wie: "Kurzfassung auf Basis der gelieferten E-Mails", "Zusammenfassung nicht verfügbar", "keine Details", "nicht genug Kontext".
- Nutze Betreff/Inhalt, um Thema, Ziel/Problem und ggf. nächsten Schritt zusammenzufassen.
- Wenn es (technisch) komplex ist, bitte 1-2 Sätze zusätzlich für eine verständliche Beschreibung nutzen. Bei einfachen, verständlichen Aspekten bitte kompakt bleiben.

Anforderung an "tasks":
- Diese sind aus der Email abzuleiten wenn diese an Hagen (Paul) Pfeifer (hagen@jauu.net) direkt addresiert sind.
- Aufgaben, wenn diese an die gesamte Gruppe gerichtet sind.
- Tasks bitte kompakt beschreiben.

Priorität:
- "high" bei klarer Dringlichkeit (Frist, wiederholte Erinnerung/„ping“, explizit eilig, unmittelbarer Handlungsbedarf), sonst "normal".

Keine anderen Felder ausgeben. Keine Inhalte erfinden; nur mit gelieferten E-Mails arbeiten.
"""

class Analyzer:
    def __init__(self, model:str):
        self.model = model or "gpt-4o"

    def _http_responses(self, body:dict)->str:
        key=env("OPENAI_API_KEY", req=True)
        req=urllib.request.Request(
            "https://api.openai.com/v1/responses",
            data=json.dumps(body).encode("utf-8"),
            headers={"Content-Type":"application/json","Authorization":f"Bearer {key}"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=120) as r:
            data=json.load(r)
        txt=data.get("output_text")
        if txt: return txt.strip()
        segs=[]
        for seg in data.get("output",[]):
            t=seg.get("text")
            if not t and isinstance(seg.get("content"),list) and seg["content"]:
                t=seg["content"][0].get("text")
            if t: segs.append(t)
        return "".join(segs).strip()

    def _extract_json_object(self, txt):
        if isinstance(txt, dict): return txt
        if isinstance(txt, list): return txt[0] if txt and isinstance(txt[0], dict) else {}
        s = (str(txt) if txt is not None else "").strip()
        try:
            obj = json.loads(s)
            if isinstance(obj, dict): return obj
        except Exception:
            pass
        m = re.match(r"^```(?:json)?\s*(.*?)\s*```$", s, flags=re.DOTALL|re.IGNORECASE)
        if m:
            inner = m.group(1).strip()
            try:
                obj = json.loads(inner)
                if isinstance(obj, dict): return obj
            except Exception:
                pass
        start = s.find("{")
        while start != -1:
            depth = 0
            for i, ch in enumerate(s[start:], start):
                if ch == "{": depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        chunk = s[start:i+1]
                        try:
                            obj = json.loads(chunk)
                            if isinstance(obj, dict): return obj
                        except Exception:
                            break
            start = s.find("{", start + 1)
        if s.startswith("{") and s.endswith("}"):
            try:
                repaired = re.sub(r"(['\"])\\?([a-zA-Z0-9_]+)\\?(['\"])\s*:", r'"\2":', s)
                obj = json.loads(repaired)
                if isinstance(obj, dict): return obj
            except Exception:
                pass
        return {}

    def _is_generic_or_empty(self, summary:str)->bool:
        s=(summary or "").strip().lower()
        if len(s)<20: return True
        bad = [
            "kurzfassung auf basis der gelieferten e-mails",
            "zusammenfassung nicht verfügbar",
            "keine details",
            "nicht genug kontext",
            "keine zusammenfassung",
            "n/a",
        ]
        return any(b in s for b in bad)

    def analyze(self, messages:list)->dict:
        base={
            "model": self.model,
            "input":[
                {"role":"system","content":[{"type":"input_text","text":SYSTEM_PROMPT_JSON}]},
                {"role":"user","content":[
                    {"type":"input_text","text":"Analysiere und liefere NUR JSON (summary 1–3 Sätze, nicht leer, keine Floskeln):"},
                    {"type":"input_text","text":json.dumps(messages, ensure_ascii=False)}
                ]}
            ],
            "temperature":0.2
        }
        try:
            txt=self._http_responses({**base, "response_format":{"type":"json_object"}})
        except Exception:
            txt=self._http_responses(base)
        obj = self._extract_json_object(txt) or {"summary":"", "tasks":[], "priority":"normal"}

        def last_snippet(ms: list) -> str:
            if not ms: return ""
            body=(ms[-1].get("body") or "")
            for ln in body.splitlines():
                s=ln.strip()
                if len(s)>=40:
                    return s[:400]
            return body[:200]

        if self._is_generic_or_empty(obj.get("summary","")) and messages:
            subj=(messages[0].get("subject") or "").strip()
            hint = (
                "Die Summary darf NICHT generisch sein. Fasse 2–5 Sätze präzise zusammen. "
                f"Betreff der ersten Mail: {subj!r}. "
                f"Auszug der letzten Mail: {last_snippet(messages)!r}."
            )
            stronger={
                **base,
                "input":[
                    {"role":"system","content":[{"type":"input_text","text":SYSTEM_PROMPT_JSON}]},
                    {"role":"user","content":[
                        {"type":"input_text","text":hint},
                        {"type":"input_text","text":json.dumps(messages, ensure_ascii=False)}
                    ]}
                ]
            }
            try:
                txt2=self._http_responses({**stronger, "response_format":{"type":"json_object"}})
            except Exception:
                txt2=self._http_responses(stronger)
            obj2=self._extract_json_object(txt2)
            if isinstance(obj2, dict) and obj2:
                obj=obj2

        pr=str(obj.get("priority","normal")).strip().lower()
        if pr not in ("normal","high"): pr="normal"
        tasks=obj.get("tasks") or []
        if not isinstance(tasks,list): tasks=[]
        return {"summary":(obj.get("summary") or "").strip(), "tasks":tasks, "priority":pr}

class Renderer:
    def __init__(self, maildir_path:str):
        self.maildir_path = maildir_path

    def wrap_summary(self,text:str)->str:
        return textwrap.fill((text or "").strip(), width=89,
                             initial_indent="  ", subsequent_indent="  ",
                             replace_whitespace=True, drop_whitespace=True)

    def conv_line(self,names:List[str])->str:
        cnt=Counter(n or "(unknown)" for n in names)
        ordered=sorted(cnt.items(), key=lambda kv:(-kv[1], kv[0].lower()))
        parts=[f"\"{n}\" ({c}x)" for n,c in ordered]
        return f"{BOLD+CYAN}Konversation: {RESET}" + ", ".join(parts)

    def _fw(self,s: str, w: int) -> str:
        s = (s or "").strip()
        return s[:w].ljust(w)

    def _rel_abs_line(self,label: str, dt: datetime) -> str:
        rel = human_delta(dt)
        abs_s = dt.astimezone().strftime("%Y-%m-%d %H:%M")
        return f"{BOLD+CYAN}{label:<20}{RESET}{BRIGHT_WHITE}{self._fw(rel, 30)}{RESET} {DIM}({abs_s}){RESET}"

    def reply_cmd(self, msgid:str)->str:
        msgid = msgid or ""
        return f'Reply: mutt-offline -f {self.maildir_path} -e "push l~i{msgid}\\nr"'

    def print_block(self, conv:Conversation, summary:str, priority:str, tasks:List[str]):
        print(separator_line())
        if conv.first_dt == conv.last_dt:
            print(self._rel_abs_line("Datum:", conv.last_dt))
        else:
            print(self._rel_abs_line("Datum letzte Email:", conv.last_dt))
            print(self._rel_abs_line("Datum erste Email:",  conv.first_dt))
        subj = sanitize_subject_ascii(conv.first_subject)
        print(f"{BOLD+CYAN}Betreffzeile: {RESET}{BRIGHT_YELLOW}{subj}{RESET}")
        print(self.conv_line(conv.names))
        print(f"{BOLD+CYAN}Summary:{RESET}")
        print(self.wrap_summary(summary if summary else "(keine Zusammenfassung vom Modell)"))
        if priority=="high":
            print(f"{BOLD+CYAN}Priorität: {RESET}{RED}high{RESET}")
        else:
            print(f"{BOLD+CYAN}Priorität: {RESET}normal")
        if tasks:
            print(f"{BOLD+RED}Aufgaben für mich:{RESET}")
            for t in tasks:
                t=(t or "").strip()
                if not t: continue
                print(textwrap.fill(t, width=89, initial_indent="- ", subsequent_indent="  "))
        print(GREY + self.reply_cmd(conv.last_message_id) + RESET)

def convo_to_model_messages(conv:Conversation)->List[dict]:
    return [{"date": m.date_str, "from_name": m.from_name, "from_email": m.from_email, "subject": m.subject, "body": m.body} for m in conv.messages]

def compute_stats(convs: List[Conversation]) -> Dict[str, object]:
    emails = sum(len(c.messages) for c in convs)
    threads = len(convs)
    authors_all = []
    for c in convs:
        for m in c.messages:
            authors_all.append(m.from_email or m.from_name or "(unknown)")
    unique_authors = len(set(a.lower() for a in authors_all if a))
    avg_len = (emails / threads) if threads else 0.0
    all_dates = [m.date_dt for c in convs for m in c.messages if m.date_dt]
    span = ""
    if all_dates:
        oldest = min(all_dates); newest = max(all_dates)
        span = f"{oldest.astimezone().strftime('%Y-%m-%d %H:%M')}  …  {newest.astimezone().strftime('%Y-%m-%d %H:%M')}"
    top = Counter(a or "(unknown)" for a in authors_all).most_common(3)
    return {
        "emails": emails,
        "threads": threads,
        "authors": unique_authors,
        "avg_thread_len": avg_len,
        "time_span": span,
        "top_authors": top,
    }

def print_stats(stats: Dict[str, object]):
    print(f"- Emails: {stats['emails']}")
    print(f"- Threads: {stats['threads']}")
    print(f"- Authors: {stats['authors']}")
    if stats["avg_thread_len"]:
        print(f"- Avg/Thread: {stats['avg_thread_len']:.2f}")
    if stats["time_span"]:
        print(f"- Span: {stats['time_span']}")
    if stats["top_authors"]:
        tops = ", ".join(f"{name} ({cnt})" for name,cnt in stats["top_authors"])
        print(f"- Top Authors: {tops}")
    print(separator_line())

def main()->int:
    ap=argparse.ArgumentParser(description="Maildir/Notmuch -> AI Summary je Thread (mit Reply-Zeile + Stats)")
    ap.add_argument("--hours", type=int, default=12)
    ap.add_argument("--folder", default="INBOX", help="Notmuch folder:… Filter (Default)")
    ap.add_argument("--tag", default=None, help="Notmuch tag:… Filter (Alternative zu --folder), linux-perf, linux-pm-intel, linux-trace, linux-bpf, ..")
    ap.add_argument("--query", default=None, help="Komplette Notmuch-Query; überschreibt --folder/--tag, z.b. tag:linux-perf and from:hagen@jauu.net")
    ap.add_argument("--max-threads", type=int, default=None)
    ap.add_argument(
        "--model",
        default=os.environ.get("OPENAI_MODEL", "gpt-4o"),
        choices=["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "gpt-3.5-turbo", "o1", "o4-mini"]
    )
    ap.add_argument("--maildir-path", default=env("MAILDIR_PATH","/home/pfeifer/.mail/INBOX/"))
    args=ap.parse_args()

    nm_query = build_notmuch_query(args.folder, args.tag, args.query, args.hours)

    backend=NotmuchBackend()
    analyzer=Analyzer(args.model)
    renderer=Renderer(args.maildir_path)

    convs=backend.fetch_conversations(query=nm_query, max_threads=args.max_threads)
    if not convs:
        print("- Emails: 0\n- Threads: 0\n- Authors: 0")
        return 0

    stats = compute_stats(convs)
    print_stats(stats)

    for conv in convs:
        ai = analyzer.analyze(convo_to_model_messages(conv))
        renderer.print_block(conv, ai.get("summary","").strip(), (ai.get("priority") or "normal").strip().lower(), [t for t in (ai.get("tasks") or []) if (t or "").strip()])
    return 0

if __name__ == "__main__":
    sys.exit(main())
``` 

