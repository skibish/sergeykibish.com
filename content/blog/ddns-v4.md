---
title: "DDNS v4"
description: >
  Can't believe that I wrote DDNS 4 years ago, in 2017.
  And my first blog post was related to it.

  I had thoughts for a long time that it's time to rewrite it and finally it happened!

  This week DDNS v4 has been released.

  In this blog post I want to walk you through my thought process behind v4 and what influenced its rewrite.
  It's time for a retro.
date: 2021-05-23T16:40:04+03:00
blog/categories:
  - Side Projects
blog/tags:
  - DDNS
  - Go
  - DigitalOcean
  - Developer Experience
---

Can't believe that I wrote DDNS 4 years ago, in 2017.
And my [first blog post]({{<relref "/blog/your-personal-ddns.md">}}) was related to it.

I had thoughts for a long time that it's time to rewrite it and finally it happened!

This week [DDNS v4 has been released](https://github.com/skibish/ddns).

In this blog post I want to walk you through my thought process behind v4 and what influenced its rewrite.
It's time for a retro.

## Retro

At the time of writing project collected 183 stars, 19 forks, 8 watchers and 5 contributors.
I wrote this tool for myself with a very narrow use case in mind and I haven't expected that others will have an interest in it.
But my assumption was wrong and I'm happy to see that this tool is widely used by others.

### 1.0.0 (14 Mar 2017)

[GitHub release](https://github.com/skibish/ddns/releases/tag/1.0.0)

Initial release.
It works, can update IP address in DNS, seems like everything is fine and solves my problem.

### 2.0.0 (25 Jun 2017)

[GitHub release](https://github.com/skibish/ddns/releases/tag/2.0.0)

Notifications were added because I wanted to know when IP is updated.

### 2.2.0 (11 Mar 2018)

[GitHub release](https://github.com/skibish/ddns/releases/tag/2.2.0)

[1st "external" GitHub issue](https://github.com/skibish/ddns/issues/4) which stated that it doesn't support IPv6 addresses.
This was true, because for myself I only needed IPv4 addresses.

This is how `ipv6` flag was added to the project with help of a [contribution](https://github.com/skibish/ddns/pull/5).

### 3.0.0 (15 Aug 2019)

[GitHub release](https://github.com/skibish/ddns/releases/tag/3.0.0)

Then additional request came to [add support of multiple domains](https://github.com/skibish/ddns/issues/6) which... was added but in a simplistic way to avoid huge refactoring of the codebase.

And that's all.

### Small updates and requests

During the last three years there were no major updates.
There were mainly releases which touched build processes, update of language version, but no so much in terms of functionality.
Because it works.
Why to touch something if it works?

Imagine, no huge updates for almost three years, since 2019.
What a breeze.

Last year people from different sources (e.g. LinkedIn) started to approach me and ask how they could solve this or that, what issues they face.
At this moment I understood that there are even more DDNS users than I have expected.
Most of them do not go to GitHub and fill issues.

I made a todo task in my list to give an overhaul of DDNS at some point.
And this is the result.

## What's different?

Now DDNS is more flexible than ever.

- Want do update multiple domains?
You can do that.
- Want to update different records for those domains?
You are free to do it.
- Want to set DigitalOcean token via environment variable and not in configuration file?
You can to this too.
- More meaningful logs on what's happening?
Yes.
- Want to send notifications to multiple sources of the same type?
Say no more.

You can find more details in the [README.md](https://github.com/skibish/ddns) of the project.
Just take a look, it's so good.

## Behind the scenes

During these years I did a lot of different stuff and my view on software,  how it should work, look and feel has changed.
And these views based on experience are now incorporated as part of this tool.

Ideas like:

- Minimalism
- The Twelve-factor app methodology
- Predictability
- Transparency
- Simpler maintainability and extendability

## Summary

- **What you write in Open Source can be extensively used by others and you would not know about this.**
From one point of view it is cool, from other --- you don't hear feedback that might bring a product to an absolutely new level.
- **Go is still a language of my choice.**
Writing in it is a joy.
It is so fantastic to see that even many years later code looks fresh and you don't need to learn some new syntax.
- **Minimal solutions win.**
As mentioned [in this article]({{<relref "blog/influence-of-minimalism.md">}}) --- minimalism in thinking lead to simple solutions.
Yes, simple solutions require a lot of thought process but it is worth it.
Simple solutions are well thought, they are predictable and easy to manage.
- **A lot of reading and thinking makes you a better engineer.**
Because of my current role, I do not write a lot of production code.
But I read a lot of materials and try different things to explain and propose best solutions to clients.
I mistakenly thought that not writing degrade my coding skills.
But no, actually I became a lot better in coding.

Thanks for you time and keep doing great things!
