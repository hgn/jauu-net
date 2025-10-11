---
title: "Linux-Systemanalyse – Das Buch"
layout: "about/single"
showToc: false
showBreadCrumbs: false
disableShare: true
showReadingTime: false
disableSpecial1stPost: false
displayFullLangName: false
showPostNavLinks: false
showCodeCopyButtons: false
showRssButtonInSectionTermList: false
tocOpen: false
summary: ""
placeholder: ""
hideMeta: true
hideTitle: true
---

<h1>Linux-Systemanalyse – Das Buch</h1>

Willkommen zur offiziellen Buchseite von <strong>Linux-Systemanalyse</strong> –
einem systematischen Leitfaden zur Analyse moderner Linux-Systeme.

<picture>
  <source srcset="/images/hgn-book-anim.webp" type="image/webp">
  <img
    src="/images/hgn-book-anim.gif"
    alt="Animation des Buchs »Linux-Systemanalyse«"
    loading="lazy"
    decoding="async"
    style="max-width:100%;height:auto;border-radius:12px"
  >
</picture>

<!--
> Apologies that this page is in German; the book is in German, so the book
> page is as well.
-->

<section class="reviews" aria-label="Rezensionen">
  <figure class="review">
    <blockquote>
      <p>„Hagens umfassendes Kompendium verbindet Kernelverständnis mit praktischem Toolwissen – klar strukturiert und praxisnah. Ein Muss für jeden Entwickler!“</p>
    </blockquote>
    <figcaption>— Daniel Borkmann; BPF Maintainer</figcaption>
  </figure>

  <figure class="review">
    <blockquote>
      <p>„Eine sehr gute Einführung in die Grundlagen der Performance- und Systemanalyse sowie in alle gängigen Werkzeuge. Dank der Verbindung praxisrelevanter Hardwareeigenschaften mit Anwendungsbeispielen aus verschiedensten Kernel-Subsystemen ist das Werk auch als Nachschlagewerk unverzichtbar.“</p>
    </blockquote>
    <figcaption>— Florian Westphal; Netfilter Maintainer</figcaption>
  </figure>
</section>

<style>
/* Zwei Spalten à 50 % des Inhaltsbereichs */
.reviews {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 50/50 */
  gap: 1.5rem;
  margin: 1.25rem 0 2rem;
}
.review {
  padding: 1rem 1.25rem;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 12px;
  background: rgba(0,0,0,0.02);
}
.review blockquote {
  margin: 0 0 .75rem 0;
  font-style: italic;
}
.review figcaption {
  font-size: .95rem;
  opacity: .85;
}

/* Dark-Mode-Optik verbessern, falls vorhanden */
@media (prefers-color-scheme: dark) {
  .review {
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.03);
  }
}

/* Mobil: einspaltig */
@media (max-width: 820px) {
  .reviews { grid-template-columns: 1fr; }
}
</style>

---

## Kurzbeschreibung

<strong>Linux-Systemanalyse</strong> verbindet tiefes Systemverständnis mit
einer reproduzierbaren Methodik. Von Symptomen wie CPU-Lastspitzen,
I/O-Einbrüchen, Realtime-Latenzen und Energieverbrauch führt das Buch zu
belastbaren Ursachen – mit Werkzeugen wie <em>perf</em>, <em>ftrace</em>,
<em>eBPF</em>, System-Tracer und einem klaren Vorgehensmodell für Messen,
Verifizieren und Optimieren.

**Untertitel:** Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen

**Zielgruppen:** Software-/Systementwickler, Performance- und
Reliability-Ingenieure, SRE/DevOps, Embedded-Linux-Teams, Studierende.

**Lernziele (Auswahl):**

- Hypothesenbasiert analysieren statt „raten“; Messergebnisse reproduzierbar dokumentieren
- CPU-Frontend/Backend, Scheduler-Verhalten und Latenzpfade quantifizieren
- Speicher-Hotspots (Page Cache, Slab, Huge Pages, DAMON) erkennen
- Dateisystem/Block-I/O instrumentieren (Tracepoints, blktrace)
- Zeit/Timer (HRTimer, Tickless, Timer-Slack) korrekt bewerten
- Energiemanagement (C/P-States, Uncore, RAPL) messen und optimieren
- eBPF sicher einsetzen (CO-RE, Maps, Tools)

---

## Leseprobe & ToC

- **Beispielkapitel (PDF):** [/downloads/linux-analyse/flepa-book-toc.pdf](/downloads/linux-analyse/flepa-book-toc.pdf)  
- **Inhaltsverzeichnis (PDF):** [/downloads/linux-analyse/flepa-book-toc.pdf](/downloads/linux-analyse/flepa-book-toc.pdf)  

**Inhaltsüberblick (Auszug):**

- Teil I – Werkzeuge: perf, eBPF, System-Tracer, Frontends  
- Teil II – Subsysteme: CPU, Task Scheduling, Speicher, Dateisystem, Zeit/Timer, Energiemanagement  
- Methodologie: Anforderungen, Vergleichbarkeit, Datenhaltung, Kommunikation, Integration in Entwicklungszyklen  
- Anhänge: Benchmarking, Setups (Debian VM, Kernel-Build, Debug), Binäranalyse, Literatur, Stichwortverzeichnis

---

## Errata & Feedback

Fehler gefunden oder Verbesserungsvorschläge?
- **Errata per Mail:** <a href="mailto:hagen@jauu.net">hagen@jauu.net</a>  
- Bitte Seite, Abschnitt/Zeilennummer und kurze Beschreibung angeben.  
- Der öffentliche Errata-Stand wird hier fortlaufend gepflegt.

| ID | Kapitel / Seite | Fehler (kurz) | Status | Fixed in | Datum | Reporter |
|----|------------------|---------------|--------|----------|--------|----------|
| EA-YYYY-NNN | – | – | gemeldet | — | YYYY-MM-DD | N.N. |

*Stand: wird fortlaufend aktualisiert.*

---

## Bibliografische Angaben

**Autor:** Hagen Paul Pfeifer  
**Titel:** Linux-Systemanalyse — Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen  
**Auflage/Ort/Jahr:** 1. Auflage, München – 2025  
**ISBN:** 978-3-8192-1292-5  

**Copyright:** © 2022 – 2025 Hagen Paul Pfeifer  
**Version:** 2025-09-28

**Verlag:** BoD – Books on Demand GmbH, In de Tarpen 42, 22848 Norderstedt, <a href="mailto:bod@bod.de">bod@bod.de</a>  
**Lektorat:** Roberta Martin, Berlin  
**Druck:** Libri Plureos GmbH, Friedensallee 273, 22763 Hamburg

**Deutsche Nationalbibliothek:** Die DNB verzeichnet diese Publikation in der Deutschen Nationalbibliografie; bibliografische Daten: <a href="https://dnb.dnb.de">https://dnb.dnb.de</a>.

---

## Rechtliche Hinweise

Das Werk ist urheberrechtlich geschützt. Alle Rechte vorbehalten. Die
Verwendung von Texten und Illustrationen – auch auszugsweise – ist ohne
schriftliche Zustimmung des Autors unzulässig.  Die automatische Analyse des
Werkes, um Informationen über Muster, Trends und Korrelationen gemäß §44b UrhG
(„Text und Data Mining“) zu gewinnen, ist untersagt.  Trotz größter Sorgfalt
kann keine Haftung für Fehler und deren Folgen übernommen werden.
Wiedergegebene Gebrauchs- und Handelsnamen können Marken sein und unterliegen
den gesetzlichen Bestimmungen.

---

## Zitieren

BibTeX:

```
@book{Pfeifer2025LinuxAnalyse,
 author = {Hagen Paul Pfeifer},
 title = {Linux-Systemanalyse},
 subtitle = {Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen},
 year = {2025},
 isbn = {978-3-8192-1292-5},
 address = {München},
 publisher = {Books on Demand},
 url = {https://jauu.net/linux-analyse/}
}
```


---

## Kontakt

Allgemeine Fragen und Anmerkungen: <a href="mailto:hagen@jauu.net">hagen@jauu.net</a>  
Homepage: <a href="https://jauu.net/linux-analyse/">https://jauu.net/linux-analyse/</a>

---

## Bewertung

Wenn Ihnen das Buch gefällt, freue ich mich über eine Rezension (z. B. bei Amazon) oder eine Rückmeldung per E-Mail.
