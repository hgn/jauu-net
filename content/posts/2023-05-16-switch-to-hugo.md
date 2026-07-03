---
title: "Migration to Cloudflare & Hugo"
date: 2023-05-16T15:21:21+02:00
draft: false
toc: false
description: "Why this site moved from Jekyll and Google hosting to Hugo behind Cloudflare."
editPost:
    URL: "https://github.com/hgn/jauu-net/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
hideSummary: false
ShowRssButtonInSectionTermList: true
---

After a period of inactivity (~11 years now, with the exception of 2 posts, 7
years ago) in managing my website, it became clear that an upgrade to my web
infrastructure was essential. Due to outdated scripts and other technical
challenges, I've opted for a comprehensive overhaul of my web hosting
solutions. Consequently, I am transitioning from Jekyll and Google Hosting to
adopting Hugo, in combination with Cloudflare, for a more robust and updated
online presence.

I realised the need for this change when I realised that my website, although
up-to-date and relevant to some degree in terms of content, was lagging behind
technologically. A key concern was the implementation of TLS (HTTPS) to ensure
a secure and encrypted connection for visitors to my website. In our
increasingly security-conscious digital landscape, this is no longer an option,
but a necessity.

I used to build the website data locally and transfer it to the server via scp.
This process was cumbersome and inefficient. My goal was to simplify updating
the website so that a simple `git push` triggers all the necessary steps -
cloudflare is great here.

The decision was made in favour of Cloudflare, which now supports QUIC for
websites. This switch provided the perfect opportunity not only to change
hosting, but also to update the website generator. Hugo, known for its speed
and multilingualism, was the ideal choice.

However, the switch to Hugo was not technically easy and it was not possible to
migrate all the older pages. However, most of the content is available in the
Internet archive and accessible to interested parties.

By combining Hugo and Cloudflare, I now benefit from low latency, fast content
delivery through HTTP/3 (QUIC), HTTP/2 (TCP), HTTP/1.1 fallback and
comprehensive IPv4 and IPv6 support. This ensures that my website is not only
secure and up-to-date, but also quickly and reliably accessible to visitors
worldwide.

Modernising my web hosting is a step towards keeping up with technological
developments and providing a high quality, secure and fast online presence.
