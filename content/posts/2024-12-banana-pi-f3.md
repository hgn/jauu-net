---
title: "RISC-V Development Board - Banana Pi F3"
description: ""
date: 2024-12-28T10:57:20+01:00
draft: false
tags: ["linux"]
toc: false
editPost:
    URL: "https://github.com/hgn/jauu-net/tree/main/content/"
    Text: "Suggest Changes"
    appendFilePath: true
hideSummary: false
images: "images/open-graph-default.png"
ShowRssButtonInSectionTermList: true
---

# Banana Pi F3

Es ist Weihnachtszeit und ein Freund von mir hatte noch ein Banana Pi F3 günstig abzugeben. Genau die richtige Gelegeneheit um bei den Schwiegereltern ist der Zeit zwischen Frühstück und Abendessen dies als Spielprojekt mal in betrieb zu nehmen und das Board mal vorzustellen.

## RISC-V

Kern des System ist eine octa-core 64-bit RISC-V CPU. Laut Aussage SpacemiT ist
die single Core CPU Leistung  30% ahead of ARM A55. Die CPU Pipeline ist Eight-stage dual-issue in-order pipeline.
1MB of shared L2 Cache for every eight cores

Die CPU enthält einen
Vector Computing Extenstion unterstützt RISC-V RVA22 Profile and 256-bit RVV 1.0 standard. 

Der Octa Core wird in zwei Cluster (SpacemiT X60) bereitgestellt, wobei jeder Cluster folgende Eigenschaften Aufweist:

- Quad-core RISC-V 64GCVB and RVA22
- Each core has 32KB L1-I Cache and 32KB L1-D Cache
- Each cluster has 512KB L2 Cache
- 512KB TCM
- Vector-256bit
- L1 Cache supports MESI consistency protocol, L2 Cache supports MOESI consistency protocol

```
$ hwloc-ls
Machine (3809MB total)
  Package L#0
    NUMANode L#0 (P#0 3809MB)
    L2 L#0 (512KB)
      L1d L#0 (32KB) + L1i L#0 (32KB) + Core L#0 + PU L#0 (P#0)
      L1d L#1 (32KB) + L1i L#1 (32KB) + Core L#1 + PU L#1 (P#1)
      L1d L#2 (32KB) + L1i L#2 (32KB) + Core L#2 + PU L#2 (P#2)
      L1d L#3 (32KB) + L1i L#3 (32KB) + Core L#3 + PU L#3 (P#3)
    L2 L#1 (512KB)
      L1d L#4 (32KB) + L1i L#4 (32KB) + Core L#4 + PU L#4 (P#4)
      L1d L#5 (32KB) + L1i L#5 (32KB) + Core L#5 + PU L#5 (P#5)
      L1d L#6 (32KB) + L1i L#6 (32KB) + Core L#6 + PU L#6 (P#6)
      L1d L#7 (32KB) + L1i L#7 (32KB) + Core L#7 + PU L#7 (P#7)
```

## RAM and Storage

RAM: Dual chip select 32-bit LPDDR3 SDRAM with 1866Mbps operation and a total of up to 4GB of RAM

- SPI flash
- eMMC 5.1
- SDIO3.0 SD card.
- SSD:NVMe over PCle

## GPU and Display

- Supports 3D graphics engine,compatibility with OpenCL 3.0, OpenGLES 3.2, Vulkan 1.2
- Supports 4K H.265/H.264/VP9/VP8, and other encoding/decoding formats.
- Dual-screen display support, with a maximum resolution of 1920*1440@60fps. -By MIPI-DSI,HDMI output.

## Interfaces

- 5×PCIe2.1(Combination of x2+x2+x1，5Gbps/Lane)
- 1×USB3.0（Combo PCIe2.1 x1）
- 2×USB2.0（OTG + Host）
- 2×GMAC（RGMII&1000M）
- 4×SPI、7×I2C、12×UART、2×CAN-FD、30×PWM

## Powering

A TDP von 3 bis 5Watt. Gepowered wird der SoC über USB-C oder auch über Power over Ethernet (PoE). 


# Benchmarking

