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
    fetchpriority="high"
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
    <figcaption>— Florian Westphal; Firewall Maintainer</figcaption>
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

<section class="buybox-simple" aria-label="Jetzt kaufen (Hardcover Version)">
  <h2>Jetzt kaufen</h2>
  <ul class="buybox-list">
    <li><a href="AMAZON_URL" target="_blank" rel="noopener">Bei Amazon</a></li>
    <li><a href="https://www.buchhandel.de/buch/9783819212925" target="_blank" rel="noopener">Im Buchhandel</a></li>
    <li><a href="BOD_URL" target="_blank" rel="noopener">Direkt bei BoD</a> (Kreditkarte und PayPal möglich)</li>
  </ul>
  <p class="buybox-note">
    <small class="buybox-note">Tipp: Direktkauf bei BoD bedeutet für mich den höchsten Autorenanteil – im Vergleich zu Amazon/Buchhandel bleibt pro Exemplar etwas mehr bei mir hängen.</small>
  </p>
</section>

<style>
/* Schlichte Box – angelehnt an deine Review-Karten */
.buybox-simple {
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 12px;
  background: rgba(0,0,0,0.02);
  padding: 1rem 1.25rem;
  margin: 1.25rem 0 2rem;
}

.buybox-simple h2 {
  margin: .1rem 0 .6rem 0;
  font-size: 1.15rem;
}

.buybox-list {
  margin: 0;
  padding-left: 1.2rem; /* klassische Bullet-Liste */
}

.buybox-list li {
  margin: .35rem 0;
}

/* Dark Mode wie bei den Reviews */
@media (prefers-color-scheme: dark) {
  .buybox-simple {
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.03);
  }
}
</style>




---

## Kurzbeschreibung

<strong>Linux-Systemanalyse</strong> verbindet tiefes Verständnis moderner
Linux-Systeme mit einer reproduzierbaren Methodik. Ausgangspunkt sind reale
Symptome – von CPU-Lastspitzen, I/O-Einbrüchen und sporadischen Paketverlusten
über unerklärlich viele TLB-/LLC-Misses, Branch-Mispredictions,
Thread-Lock-Contention, Priority-Inversionen und Scheduler-Anomalien bis hin zu
seltenen, aber außerhalb der Norm liegenden Echtzeitlatenzen oder erhöhtem
Energieverbrauch. Das Buch zeigt, wie du Hypothesen sauber formulierst,
Messungen kontrolliert aufsetzt, Baselines definierst und Ursachen belastbar
verifizierst – mit Werkzeugen wie <em>perf</em>, <em>ftrace</em>,
<em>eBPF</em>, Tracepoints sowie System-Tracern (z. B. Intel PT, ARM CoreSight,
Perfetto/Trace Compass) – und daraus zielgerichtete Optimierungen ableitest.

Weitere Use Cases: NUMA-Imbalance und Cache-Interferenzen identifizieren,
Syscalls und Filesystem-Hotspots quantifizieren, IRQ-Storms und
Timer-Streueffekte einkreisen, C-/P-State-Wechsel und Thermal-Throttling
sichtbar machen, Garbage-Collector-Pauses und Memory-Fragmentierung bewerten,
cgroup-Limits und CPU-Affinity präzise justieren, Regressionsanalysen nach
Kernel-/Compiler-Updates durchführen und Fixes dauerhaft absichern und vieles
weitere mehr.

**Untertitel:** Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen

**Zielgruppen:** Software-/Systementwickler, Performance- und
Reliability-Ingenieure, Software-Architekten, SRE/DevOps, Kernel-Entwickler,
Embedded-Linux-Teams, Sicherheitsforscher und natürlich Studierende.

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

<img
  src="/images/flepa-book-landscape.jpg"
  alt="Buchansicht »Linux-Systemanalyse« im Querformat"
  loading="lazy"
  decoding="async"
  style="max-width:100%;height:auto;border-radius:12px"
/>

- **Beispielkapitel "Zeit und Timer" (PDF):** [flepa-book-timer.pdf](/downloads/linux-analyse/flepa-book-timer.pdf)  
- **Inhaltsverzeichnis (PDF):** [flepa-book-toc.pdf](/downloads/linux-analyse/flepa-book-toc.pdf)  

**Inhaltsüberblick (Auszug):**

- **Teil I** – Werkzeuge: perf, eBPF, System-Tracer, Frontends  
- **Teil II** – Subsysteme: CPU, Task Scheduling, Speicher, Dateisystem, Zeit/Timer, Energiemanagement  
- **Teil III** - Methodologie: Anforderungen, Vergleichbarkeit, Datenhaltung, Kommunikation, Integration in Entwicklungszyklen  
- **Anhänge** Benchmarking, Setups (Debian VM, Kernel-Build, Debug), Binäranalyse, Literatur, Stichwortverzeichnis

---

## Beispielcode & Begleitmaterial

Der komplette Beispielcode zum Buch liegt öffentlich auf GitHub.

- Repository: **src/**  
  https://github.com/hgn/linux-analysis/tree/master/src
- ZIP-Download (aktueller Stand, Branch `master`):  
  https://github.com/hgn/linux-analysis/archive/refs/heads/master.zip
- Issues/Fragen:  
  https://github.com/hgn/linux-analysis/issues/new

### Quickstart

```bash
# 1) Klonen
git clone https://github.com/hgn/linux-analysis.git
cd linux-analysis/src

# 2) Werkzeuge (Beispiele für Debian)
$ sudo apt-get update
$ sudo apt-get install -y linux-perf bpftrace clang llvm make python3 python3-venv

# 3) Ein einfaches Beispiel ausführen (siehe README in src/)
$ cd greedy-brk-alloctor/
$ make all
````

### Voraussetzungen

* **Kernel:** aktueller Distro-Kernel; eBPF-Beispiele benötigen BTF/CO-RE.
* **Rechte:** teils `root`/`CAP_SYS_ADMIN` (perf systemweit, ftrace mount, eBPF attach).
* **Pakete:** `linux-perf`, `bpftrace`, `clang`/`llvm`, `make`; optional Python für Auswertung.


### Lizenz

Der **Beispielcode** zum Buch ist **Public Domain**. Du darfst damit **alles**
machen – nutzen, kopieren, verändern, weiterverbreiten, kommerziell verwenden –
**ohne Auflagen**.

---

## Errata & Feedback

Fehler gefunden oder Verbesserungsvorschläge?
- **Errata per Mail:** [hagen@jauu.net](mailto:hagen@jauu.net?subject=%5BLinux-Systemanalyse%5D%20Errata&body=Seite:%20%0D%0AKapitel/Abschnitt:%20%0D%0ABeschreibung:%20%0D%0AVorschlag%20zur%20Korrektur:%20)
- Bitte Seite, Abschnitt/Zeilennummer und kurze Beschreibung angeben.  
- Der öffentliche Errata-Stand wird hier fortlaufend gepflegt.

| ID | Seite | Fehler (kurz) | Fixed in | Datum | Reporter |
|----|------------------|---------------|--------|----------|--------|----------|
| YYYY-NNN | – | – | — | YYYY-MM-DD | N.N. |

*Stand: wird fortlaufend aktualisiert.*

---

## Zitieren

<strong>BibTeX</strong>

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

<strong>IEEE</strong>

```
H. P. Pfeifer, Linux-Systemanalyse: Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen. Hamburg, Germany: Books on Demand, 2025. ISBN 978-3-8192-1292-5.
```

<strong>RIS (EndNote/RefMan)</strong>


```
TY  - BOOK
AU  - Pfeifer, Hagen Paul
TI  - Linux-Systemanalyse: Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen
PY  - 2025
SN  - 978-3-8192-1292-5
PB  - Books on Demand
CY  - Hamburg
UR  - https://jauu.net/linux-analyse/
ER  -
```



---

## Kontakt

Allgemeine Fragen und Anmerkungen: <a href="mailto:hagen@jauu.net">hagen@jauu.net</a>  
Homepage: <a href="https://jauu.net/linux-analyse/">https://jauu.net/linux-analyse/</a>

---

## Bewertung

Wenn Ihnen das Buch gefällt, freue ich mich über eine Rezension (z. B. bei Amazon) oder eine Rückmeldung per E-Mail.

---

## Bibliografische Angaben

**Autor:** Hagen Paul Pfeifer<br />
**Titel:** Linux-Systemanalyse<br />
**Subtitel:** Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen<br />
**Seiten:** 860<br />
**Auflage/Ort/Jahr:** 1. Auflage, München – 2025<br />
**ISBN:** 978-3-8192-1292-5<br />
**Copyright:** © 2022 – 2025 Hagen Paul Pfeifer<br /><br />

**Lektorat:** Roberta Martin, Berlin <br /> 
**Verlag:** BoD – Books on Demand GmbH, Überseering 33, 22297 Hamburg<br />
**Druck:** Libri Plureos GmbH, Friedensallee 273, 22763 Hamburg<br /><br />

**Deutsche Nationalbibliothek:** Die DNB verzeichnet diese Publikation in der Deutschen Nationalbibliografie; bibliografische Daten: <a href="https://dnb.dnb.de">https://dnb.dnb.de</a>.

### Ausstattung 978-3-8192-1292-5 (Hardcover Version)

| Merkmal                 | Wert                |
|-------------------------|---------------------|
| Seitenzahl              | **860**             |
| Format                  | **15,5 × 22 cm**    |
| Einband                 | **Hardcover**       |
| Laminierung             | **Matt**            |
| Papier                  | **Weiß 90 g**       |
| Buchrücken              | **Gerundeter Rücken** |
| Bindung                 | **Fadenbindung**    |

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


<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "Linux-Systemanalyse",
  "alternateName": "Von High-Level-Architekturanalysen zu Low-Level-Code-Optimierungen",
  "author": { "@type": "Person", "name": "Hagen Paul Pfeifer" },
  "isbn": "978-3-8192-1292-5",
  "inLanguage": "de",
  "bookFormat": "https://schema.org/Hardcover",
  "numberOfPages": 860,
  "datePublished": "2025",
  "publisher": { "@type": "Organization", "name": "Books on Demand" },
  "image": "https://jauu.net/static/images/hgn-book-anim.webp",
  "url": "https://jauu.net/linux-analyse/",
  "offers": {
    "@type": "Offer",
    "url": "BOD_ODER_AMAZON_URL",
    "priceCurrency": "EUR",
    "price": "64.99",
    "availability": "https://schema.org/InStock"
  },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Format", "value": "15,5 × 22 cm" },
    { "@type": "PropertyValue", "name": "Papier", "value": "Weiß 90 g" },
    { "@type": "PropertyValue", "name": "Bindung", "value": "Fadenbindung" },
    { "@type": "PropertyValue", "name": "Laminierung", "value": "Matt" },
    { "@type": "PropertyValue", "name": "Buchrücken", "value": "Gerundeter Rücken" }
  ]
}
</script>
