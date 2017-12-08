---
title: "How Docker Changed My Workflow"
date: 2017-11-22T14:45:19+02:00
draft: true
---

# Preface

This article is aimed mainly on the developers who use Linux as their OS’s for work. Others will find this article instructive which may lead to the discussions on how to archive the same on other OS’s.

# The story begins

When you work on the different projects at the same time, your environment floods with the different tools. These tools install other tools, create directories (hidden, and not only). After some usage they cache something eating your space on the drive. You try to find out where cache is or other artefacts and remove them. And you loose you time by doing this. You are stressed. You just want to install tools, and simply remove them from the system, when you’re done.

Yes, for macOS there is `brew`. Developers who use Linux know about `apt`, `yum`, etc. But even with these applications, which have `remove` commands/hooks - they do not remove everything.

# Idea and the solution

So, what to do? What can isolate these tools and make them available only when I need them and delete them, when I’m finished?

The first thing that came into my head was — Docker. Docker could be the solution to this problem. From that day, Docker changed how I work with tools during the day. Let’s explore, how you can *almost* completely dockerize your environment. This can apply to your development, test or both environments.

# Examples

For example you were punished to use node stack for next big awesome blockchain project. Basic things that should be installed are:

- node
- npm
- yarn (because we are cool and modern)

For me, installing all these things on my local system is not the best choice. What to do?

Thanks, we have Docker with us. Solution that I propose is following.

Let's deal with `yarn`. Create file `/usr/local/bin/yarn`. And this file will look as follows:

![yarn embed](https://gist.github.com/skibish/1d5474d701e69a35cb490767f19ea2cb)

As you can see, this is a bash wrapper around the docker container. And you can use it in the terminal as usual `yarn`  running all of your favourite commands. But with safe and clean environment! How cool is that?

For more examples, check out https://github.com/skibish/dockerized repository. Pull requests and ideas on dockerization are welcome.

Good luck!
