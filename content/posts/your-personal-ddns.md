---
title: "Your Personal DDNS"
date: 2017-10-13T18:27:03+03:00
draft: true
---

# Your own DDNS

According to the Wikipedia, DDNS is:

> Dynamic DNS (DDNS or DynDNS) is a method of automatically updating a name server in the Domain Name System (DNS), often in real time, with the active DDNS configuration of its configured hostnames, addresses or other information.
– Wikipedia ([source](https://en.wikipedia.org/wiki/Dynamic_DNS))

The most common use of a DDNS service is to access your computer at home or work when your IP changes dynamically. You may heard about services like [DynDNS](https://dyn.com/dns/) or [No-IP](https://www.noip.com/). You create account, install client on your machine and they give you a domain to access your computer. The most common cons of these services are the following:

- These services are not free (or for a limited time)
- You are tied to one DNS provider
- A custom domain is an extra feature

What additional features I wanted to see in DDNS service:

- Specified DNS records should be updated on IP change. Not only A, but also TXT records andothers
- When an IP is changed, I want to be notified about it
- It should be free

In the end, I haven’t found service that had such features, so that’s how [Personal DDNS Client](https://github.com/skibish/ddns) was born.

The decision was made to write client in [Golang](https://golang.org).

For a DNS provider my choice fell on [DigitalOcean Networking](https://www.digitalocean.com/products/networking/) DNS. Why?

- I use DigitalOcean for pet projects
- Their Networking stack is *free*
- DigitalOcean has amazing API for their inner services

DigitalOcean DNS became a backend for the client. To make everything to work you need to have a DigitalOcean account and setup your domain you would like to use. You can follow [this tutorial to setup your domain](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean). But we will continue.

## How to setup DDNS client?

This example will use Ubuntu Linux. You can apply the same approach to whatever distribution you like.

### Client installation

The first thing to do is  —  you should download the client using following commands:

```
> curl -L https://github.com/skibish/ddns/releases/download/2.1.2/ddns-`uname -s`-`uname -m` > /usr/local/bin/ddns
> chmod +x /usr/local/bin/ddns
```

Now `ddns` binary will be available at `/usr/local/bin/ddns`. To check, that it is installed, run `ddns -h` in the terminal. If you will see this output:

```
Usage of ddns:
  -check-period duration
    	Check if IP has been changed period (default 5m0s)
  -conf-file string
    	Location of the configuration file (default "$HOME/.ddns.yml")
  -req-timeout duration
    	Request timeout to external resources (default 10s)
```

You are ready to move forward.

### Confiration file setup

To use the client with DigitalOcean, you need to get OAuth token. How to generate it, [read here](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2).

The client requires a configuration file, where the rules to update the DNS records are described.

Create a file named `.ddns.yml` in your home directory. The most simple setup is the following:

```yaml
token: "TOKEN"              # DigitalOcean token
domain: "example.com"       # Domain to update
records:                    # Records of the domain to update
  - type: "A"               # Record type
    name: "@"               # Record name
```

In this case, the record **A** with the name **@** of the domain **example.com** will be updated with your IP. If you want to update multiple records, add them.

```yaml
token: "TOKEN"
domain: "example.com"
records:
  - type: "A"
    name: "@"
  - type: "A"
    name: "www"
  - type: "TXT"
    name: "info"
```

Now, if you will start the client, everything should work.

Congratulations! You have your own personal DDNS.

### Put DDNS in the background

But how to leave it to work in the background? A good solution would be to register a new service on your linux machine.

Create a file `/etc/systemd/system/ddns.service` (you want to create this file under `sudo` user). Paste in it the configuration that is specified bellow:

```
[Unit]
Description=DDNS client with DigitalOcean as backend
After=network.target

[Service]
ExecStart=/usr/local/bin/ddns
User=<YOUR USERNAME>
Type=simple
Restart=always

[Install]
WantedBy=default.target
```

In this configuration change `<YOUR USERNAME>` to your username. Save file.

While you are under `sudo` user enable and start this service.

```
$ systemctl enable ddns
$ systemctl start ddns
```

Cool, now you have a service that will start after computer boot up.

### Advanced configuration

In the beginning, I’ve told, that one of the advantages would be to get notifications via email. How to setup notifications?

Currently supported notification is only SMTP. If there will be more, you would be able to find them in the [README.md](https://github.com/skibish/ddns/blob/master/README.md) of the project.

```yaml
token: "TOKEN"
domain: "example.com"
records:
  - type: "A"
    name: "@"
notify:
  smtp:
    user: "foo@example.com"
    password: "1234"
    host: "smtp.example.com"
    port: "465"
    to: "foobar@gmail.com"
    subject: "My DDNS sending me a message"
    secure: true # Optional flag. Set it, if you will send emails with SSL
```

With this configuration you have now the ability to send emails.

But your emails most likely will appear in the *spam* folder. How to fix this? We can create [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework) record for the domain and mark your IP as safe for email provider.

```yaml
token: "TOKEN"
domain: "example.com"
records:
  - type: "A"
    name: "@"
  - type: "TXT"
    name: "@"
    data: "v=spf1 ip4:{{.IP}} include:_spf.example.com ~all"
notify:
  smtp:
    user: "foo@example.com"
    password: "1234"
    host: "smtp.example.com"
    port: "465"
    to: "foobar@gmail.com"
    subject: "My DDNS sending me a message"
    secure: true
```

A new **TXT** record was added with a **data** field. This field is optional. But when it is set, you can use the full potential of Golang [text/template](https://golang.org/pkg/text/template/) engine. In this case, when the IP will be updated, this TXT record will be updated too.

Using this example of a SPF record, consider, that you need to add two more IPs, but they are static values. What to do? For this case you have **parameters**.

```yaml
token: "TOKEN"
domain: "example.com"
records:
  - type: "A"
    name: "@"
  - type: "TXT"
    name: "@"
    data: "v=spf1 ip4:{{.IP}} ip4:{{.ipOne}} ip4:{{.ipTwo}} include:_spf.example.com ~all"
params:
  ipOne: "10.10.10.10"
  ipTwo: "20.20.20.20"
notify:
  smtp:
    user: "foo@example.com"
    password: "1234"
    host: "smtp.example.com"
    port: "465"
    to: "foobar@gmail.com"
    subject: "My DDNS sending me a message"
    secure: true
```

As you can see, setup is flexible and you can update a lot of things in your DNS using this tool.

## What's next

The next step would be to add the ability to choose your DNS provider, because somebody could be using, for example, [Cloudflare](https://www.cloudflare.com/dns/). But it is a step for the next release and I would be happy to accept contributions :)

[Personal DDNS is open and is available on the GitHub](https://github.com/skibish/ddns).
