---
title: "Bunny Sync: Handy Upload Helper"
description: >
  Sync local files effortlessly with Bunny Sync, a simple CLI tool designed for Bunny Storage users.
  No FTP fuss, no waiting for APIs - just quick and straightforward syncing.
date: 2023-11-02T21:52:04+02:00
blog/categories:
  - Side Projects
blog/tags:
  - Go
  - Developer Experience
---

So, I'm testing Bunny to host this site you're on, and guess what?
Uploading files to Bunny Storage isn't as straightforward as you'd hope.
That's why I rolled up my sleeves and created Bunny Sync --- a small CLI tool I thought you might find useful!

## What's Bunny Sync?

Just an easy way to sync your local files to [Bunny Storage](https://bunny.net/pricing/storage/).
No fancy stuff, just a quick solution without the fuss.

## How to Use

```bash
bunnysync \
  -src ./your_folder \
  -zone-name $STORAGE_ZONE_NAME \
  -password $STORAGE_PASSWORD
```

## Why Bunny Sync?

- No FTP headaches.
- No waiting around for Bunny's elusive S3 API.
- No need for complex `curl` setups.

Check out the [Real-life usage example](https://github.com/skibish/sergeykibish.com/blob/faf72c35bc77cb96ac211496fafe15a09d8b0f29/.github/workflows/deploy.yml#L43-L56).

## Ready to Dive In?

[Download Bunny Sync](https://github.com/skibish/bunnysync/releases)
