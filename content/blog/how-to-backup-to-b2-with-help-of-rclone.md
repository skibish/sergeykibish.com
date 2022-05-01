---
title: "How to Backup to Backblaze B2 with Rclone and keep the network alive"
description: >
  I'm living in a place with not the fastest internet download/upload (39/12 Mbps) speeds.
  It took some time to tune all the parameters of the Rclone to successfully create an initial backup (around 400GB) and keep the network alive during the upload to Backblaze B2.
date: 2021-11-27T11:30:26+03:00
blog/categories:
  - How tos
blog/tags:
  - RClone
  - Backblaze B2
  - Backups
---

Some time ago I concluded that it would be nice to have an offsite copy of the important data if something will go completely wrong.

I'm living in a place with not the fastest internet download/upload (39/12 Mbps) speeds.
It took some time to tune all the parameters of the Rclone[^1] to successfully create an initial backup (around 400GB) and keep the network alive.

## Why to backup

When you work more and more in IT you understand the importance of a good level of redundancy.
Everything breaks at some point (accidentally or on purpose), you need to have backups.

There is a 3-2-1 backup rule[^2] which is nice to follow:

> There should be at least 3 copies of the data, stored on 2 different types of storage media, and one copy should be kept offsite, in a remote location (this can include cloud storage).

I already had two pieces of the formula (3 copies, 2 of them on different external hard drives).
One was missing: offsite backup.

When I was young I had not a pleasant experience of losing hard drive and all family photos, videos, etc...
After this, I'm a little bit paranoid about where such information should be stored and how it should be backed up.

Currently, my storage environment looks as follows:

- Self-hosted instance of Nextcloud[^3] as a main source of storage
- Backups to two external hard drives

And the time came to introduce cloud backup.

## Where to backup

I've wanted something simple, cheap, secure which I can execute in the terminal and it would just work.

One of the options was to go with some VPS and rsync[^4] classic setup.
This setup is not so cheap.
Each cloud provider has a cost for bandwidth, storage and compute.
Price is very different, but with 400GB you might end up spending from $5 to $10, or more per month.
I wanted something cheaper.

I've chosen Backblaze B2[^5].
It's less than $2 ($0.0005 \* 400) per month for me.
Which is very good for me.
If I will need to extract the full backup, it will cost me $4 ($0.01 \* 400).

## How to backup

Okay, how to backup?

rsync would not work in this case because it works with file system but with B2 you would need to use API, b2 CLI, S3 compatible tools (because it is compatible with S3 API) or something else.

And I've stumbled across Rclone[^1]:

> Rclone is a command line program to manage files on cloud storage.
> It is a feature rich alternative to cloud vendors' web storage interfaces.
> Over 40 cloud storage products support rclone including S3 object stores, business & consumer file storage services, as well as standard transfer protocols.

What a beast is this tool.
It can not only backup and restore, but also encrypt and decrypt the data, mount, analyse and other stuff.
Worth checking out.

### Configuring rclone

All configuration is stored in the `rclone.conf` file which can also be encrypted and stored in the git repo.

The configuration looks similar to the below:

```ini
[local]
remote = /var/storage

[b2]
type = b2
account = BACKBLAZE_ACCOUNT_ID
key = BACKBLAZE_ACCOUNT_KEY
hard_delete = true

[b2-crypt]
type = crypt
remote = b2:backup-bucket
password = CRYPT_PASSWORD
```

These are three remotes:

- `local` is my local folder which should be backed up
- `b2` is a connection to my B2 account
- `b2-crypt` is a special remote to save files in b2 bucket encrypted.
It wraps `b2` remote.
More details can be found in the [very nice documentation](https://rclone.org/crypt/).

To do the encrypted backup, you do the following in the console:

```bash
rclone --config rclone.conf sync local: b2-crypt --progress
```

And it will start to backup.
Slowly.
And remembering my network speeds, it will start to die because `rclone` will eat all the bandwidth.
You will not be able to watch anything on YouTube or Netflix.
Even loading some blogs will take a longer time than usual.
Then rclone will tell you that it starts to drop connections sometimes.

### Rclone crashing the internet

Search will tell that you are not the only one with such a problem[^6].
If you don't have a very fancy router, you might end up with a phenomenon named bufferbloat[^7].
The question is, what to do?
We still need to backup our data.

### Time for some tuning

**Step 1**.
Take measurements of your WAN download/upload speeds with Speedtest or embedded in the router speed test tool.

Let's take my numbers from the above:

- Download: 39 Mbps
- Upload: 12 Mbps

**Step 2**.
If you have some QoS settings in the router, you might want to manually set the limits for upload and download bandwidth 10% less than measured, e.g. 35/10,8 Mbps.
This will help the router to have room to breathe.

This step is optional, but if you had some problems with the internet connection in general, this setting might help you solve the issue too.

**Step 3**.
Now we need to configure the `rclone` parameters.

```bash
rclone --config rclone.conf sync local: b2-crypt: \
  --transfers 20 \
  --b2-chunk-size 48M \
  --b2-hard-delete \
  --fast-list \
  --bwlimit "08:00,512k 12:00,10M 13:00,512k 23:00,10M" \
  --progress
```

- `--transfers` — how many files to transfer simultaneously.
Backblaze can handle a lot of simultaneous transfers and works better when there are many of them.
According to the `rclone` backblaze module documentation[^8] the recommended size is 32.
I've ended up with 20, experimentally.
- `--b2-chunk-size` — the default is 96M which is must be fine, but because speed is not fantastic and I wanted to put many files online, sliced it in half.
- `--b2-hard-delete` and `--fast-list` are optional but I've set them in my script because they are valuable during next backups.
By default, B2 does not delete files when you delete them.
In my case, I want to delete them and not store shadow copies.
Fast list helps to execute fewer commands against the service (e.g. list all files in one request and not many).
- `--bwlimit`.
This one is interesting.
Because I needed to work, I've limited `rclone` on the usage of the network.
In the example above I've instructed `rclone` to use only 512kbps starting 08:00 in the morning, a little bit more during lunch, back to 512 after and back to the maximum at night.

  If in Step 2 you enabled QoS settings on your router, then you can change `10M` to `off` (use all that is available).

## Final words

With the above recommendations, everyone in your household will be able to use the internet normally and backup will happen... but slowly.
In my case, it took around 4-5 days.
So, if you have access to the data centre or fibre network, you will have more luck!

[^1]: https://rclone.org
[^2]: https://en.wikipedia.org/wiki/Backup#3-2-1_rule
[^3]: https://nextcloud.com
[^4]: https://linux.die.net/man/1/rsync
[^5]: https://www.backblaze.com/b2/cloud-storage.html
[^6]: https://forum.rclone.org/t/rclone-crashing-internet/4593
[^7]: https://en.wikipedia.org/wiki/Bufferbloat
[^8]: https://rclone.org/b2/#transfers
