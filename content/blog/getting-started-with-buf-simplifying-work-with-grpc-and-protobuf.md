---
title: "Getting Started with Buf: Simplifying Work with Protobufs"
description: >
  Buf is a powerful tool that greatly simplifies working with Protobufs.
  It helps you lint Protofiles, ensure backward compatibility and generate code.
  Follow these tips to get started with Buf.
date: 2023-05-05T10:19:01+03:00
blog/categories:
  - How tos
blog/tags:
  - gRPC
  - Protobuf
  - Development
---

In one project, it was decided to use [gPRC](https://grpc.io)  for communication between backend components.
One of the challenges we encountered was how to ensure and enforce API backward compatibility from the start, as well as how to make sure that Protobuf definitions are documented in the same style.

I started researching and found various tools like [protolint](https://github.com/yoheimuta/protolint) and [protool](https://github.com/uber/prototool).
But one tool caught my eye: a tool named [Buf](https://buf.build/product/cli/).
At that time, it was very fresh but already looked very promising.

I decided to take a look at it, and eventually, it became the main tool in our stack and CI for gRPC-based projects.

## The problem

If you've ever worked with gRPC or Protobuf, you know that it's challenging to set up these tools correctly.
If you use plugins directly, it can take days or even longer, especially for languages that don't yet have a mature ecosystem for Protobuf.
Protobuf is not a plug-and-play tool.

## Solution

Buf changed all of that.
It's a tool that simplifies your work with Protobufs.
With Buf, you [can lint](https://buf.build/docs/tutorials/getting-started-with-buf-cli/#lint-your-api) Protofiles, detect [breaking changes](https://buf.build/docs/tutorials/getting-started-with-buf-cli/#detect-breaking-changes), and [generate code](https://buf.build/docs/tutorials/getting-started-with-buf-cli/#generate-code).

What more could you ask for?

Maintaining backward compatibility is difficult.
Developers may rush, and something might be missed.
Catching such things on a regular basis by eye is almost impossible during Pull Requests.
But with the help of Buf's breaking changes feature, it became a lot easier.

A main positive side effect that I observed was that the team started to spend more time thinking about API design and not rushing with implementation.
It helped to develop discipline and more awareness of what was being done and why within the team.

## Tips for starting with Buf

In this section, I would like to go through a few tips that might help you get started with Buf.

The first tip is about repository structure.
It should look like this:

```txt
.
├── buf.work.yaml
├── paymentapis
│   ├── acme
│   │   └── payment
│   │       └── v2
│   │           └── payment.proto
│   └── buf.yaml
```

It is not stated in the documentation that the file `buf.work.yaml` is required, but I recommend having it.
It simplifies work with other features of Buf.

The second tip is about `buf.yaml`.
If you are just starting a new project, I would recommend having the following initial configuration:

```yaml
version: v1
breaking:
  ignore_unstable_packages: true
```

I recommend enabling the [`ignore_unstable_packages` option](https://buf.build/docs/configuration/v1/buf-yaml/#ignore_unstable_packages).
This option allows you to use "unstable" packages like `v1alpha1`.
This opens the doors for experiments, API drafts that can be persisted in Git, and avoids many breaking change errors that may arise when you are in the process of designing new APIs.
Once you are done and ready to introduce new functionality in the "stable" API, you can copy and paste the definitions to the `v1` package and be sure that any breaking changes will be detected if someone tries to break something.

[Default values](https://buf.build/docs/configuration/v1/buf-yaml/#default-values) can be found in the documentation.

My third tip is to use Visual Studio Code and the Visual Studio Code and the [Buf Extensions](https://marketplace.visualstudio.com/items?itemName=bufbuild.vscode-buf).
This extension nicely highlights all the issues found in the IDE.

And that's all for today!
