---
title: "Running Azure Functions in Kubernetes is Evil"
description: >
  You might be tempted to run Azure Functions with help of Docker images in Kubernetes.
  It is possible, Azure maintains Azure Functions Docker images to help you with that.
  In this post, I will outline the reasons why running Azure Functions in Kubernetes should be avoided.
date: 2023-02-18T08:19:44-05:00
blog/categories:
  - Observations
blog/tags:
  - Azure
  - Azure Functions
---

You might be tempted to run Azure Functions with help of Docker images in Kubernetes.
It is possible, Azure maintains [Azure Functions Docker images](https://github.com/Azure/azure-functions-docker) to help you with that.
In this post, I will outline a few reasons why running Azure Functions in Kubernetes should be avoided.

## Size

It's generally a good practice to have Docker images as slim as possible.
With Azure Functions, it's not the case.

Consider the following image for Node runtime: `mcr.microsoft.com/azure-functions/node:4.15.1-node16`.
Its size is `1.25GB` which, in my opinion, is a lot to run a function.

Going through the list of available tags you might see that there is `*-slim` tag.
Unfortunately, this tag point to the same Docker image of the `1.25GB` in size.

Not so slim.

## Image tags

In the `README.md` you would see the list of tags which are pointing to major versions of runtime, for example, `4`.
And they are recommended for use.
The tag looks like `mcr.microsoft.com/azure-functions/node:4-node16`.

At the moment of writing `4.15.1` is the latest release specified in the [GitHub releases](https://github.com/Azure/azure-functions-docker/releases).
The expectation is that image `node:4.15.1-node16` and `node:4-node16` are the same because both of them should point to the latest.
Which is not true.

```sh
$ docker images | grep node16
mcr.microsoft.com/azure-functions/node   4-node16             6688e78c3239   11 days ago    1.25GB
mcr.microsoft.com/azure-functions/node   4.15.1-node16        a6d847e33364   2 months ago   1.25GB
mcr.microsoft.com/azure-functions/node   4.15.1-node16-slim   a6d847e33364   2 months ago   1.25GB
```

What are you running, exactly?

## Vulnerabilities

In many companies there are tools in use like Snyk, Aquascan which scan for vulnerabilities and if there are some, you need to resolve them.
Does Microsoft bother to fix vulnerabilities in the images?
No.
Some of them are fixed but the majority are still there and will always make your vulnerability scanners go crazy.

```sh
$ docker scan mcr.microsoft.com/azure-functions/node:4.15.1-node16
# ...
# many results
# ...
Tested 175 dependencies for known vulnerabilities, found 134 vulnerabilities.
```

That's a lot.

## Environment variables

You need to set a few environment variables to run Azure Functions successfully.
The first one is `ASPNETCORE_URLS=http://+:8080`.
It should match the exposed container port number.

The second one is `COMPlus_EnableDiagnostics=0`.
This is a requirement from .NET if you would like to run Azure Functions in a read-only container (any .NET related thing) successfully.
You could spend many hours figuring out what is wrong because an error is cryptic.
More on this you can find in [Azure/azure-functions-host#8181](https://github.com/Azure/azure-functions-host/issues/8181) and [dotnet/docs#10217](https://github.com/dotnet/docs/issues/10217).

Not transparent.

## Health checks and SIGTERM

There are no capabilities to handle those.
No options for graceful shutdown.
You need to make sure that function is idempotent
(in case of a re-execution after an error, the outcome should be identical to the previous attempt).

## Azure Storage Account

It is possible to run Azure Function without Azure Storage Account, though it is mandatory to configure it.

> When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage.
> This requirement exists because Functions relies on Azure Storage for operations such as managing triggers and logging function executions.
> Some storage accounts don't support queues and tables.
> These accounts include blob-only storage accounts and Azure Premium Storage.
> --- [source](https://learn.microsoft.com/en-us/azure/azure-functions/storage-considerations?tabs=azure-cli#storage-account-requirements)

If you run Azure Function without Storage Account, be ready to observe some strange behavior.
Azure Functions rely heavily on Storage Account for different things and for some triggers (e.g. timer).

## Scale to zero

One of the major selling points running Azure Functions in Kubernetes is scaling to zero with help of KEDA.
Microsoft even [suggests this approach](https://learn.microsoft.com/en-us/azure/azure-functions/functions-kubernetes-keda) in their documentation.

In short, KEDA monitors some resources and depending on how many events there are will scale the target workload up and down.
Azure Functions have their mechanism for how those events are read from the sources.
KEDA and Azure Functions are not connected.
When you start to play with scaling to zero you might observe that not all events are caught by Azure Function.

For example, KEDA scales Azure Function from zero to one because it sees new events, but Azure Function is not processing anything after being woken up.
Weird, but this is something I observed.

The ideal case for Azure Function is to be *always up and running*.
In this case, everything works smoothly.
But this is not something you would like to have for "serverless" workloads.

## Azure Function App

Azure Function is an [Azure Function **app**](https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal#create-a-function-app).
It is some compute (App Service) which holds *more than one* function to execute.
Azure Function is *not designed* to run only one function.
It expects to execute multiple functions within one compute.

In Kubernetes, you would like to run only one function per Azure Function app (container).
Tiny functions, execute and remove when no longer needed.

This is not the case.
So, what are the alternatives?

## Use KEDA and what Kubernetes offers

If you want to do "serverless" processing when some event arrives, you can do it on your own with KEDA and Kubernetes Jobs.

Need to connect to services in Azure?
Just use libraries.
Such a setup results in a slim Docker image with a fast startup, true scale to zero and proper error handling.

And all without the additional overhead from Azure Functions.

## Summary

Microsoft did a good work showing that you do not want to run Azure Functions on your own.
If you are just developing and playing around, running them in containers is a viable option.
For production, I would try to avoid running them in Kubernetes because Azure Functions were not designed for such use case.
