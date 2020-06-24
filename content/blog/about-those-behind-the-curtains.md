---
title: "About Those Behind The Curtains"
description: >
  About developers, operations, SREs and many others who make your business running.
  Those behind the curtains.
  I want you to think about the Developers Experience (DX).
date: 2020-06-24T17:45:17+02:00
---

I want all involved in development to think about other users.
Not about those who use your application to solve their problems.
But those who extend your app, run it in production and integrate with other systems.
About developers, operations, SREs and many others who make your business running.
Those behind the curtains.
I want you to think about the Developers Experience (DX).

## The problem

Working with different businesses and in outsource companies I've spot following tendency:
The main focus is *always* on business requirements and UI features of built application.
Because this is the first thing that real users will see.
A client who ordered a new feature would like to see a pretty demo and understand that money invested is working.
Such priority looks logical and right.
But problems are hiding behind such thinking.

There are many other users behind the curtains.
Almost nobody thinks about developer experience (except IT-focused products).
Giving priority only to business features and UI is not enough for some solutions.

Nowadays all businesses are digital.
They integrate with many systems, chats, banks, you name it.
There is always some development work happening and many of them don't focus on DX.
Which is bad.

It is bad because engineers also should feel happy using your product.
If they struggle, you as a business might have loss of trust or reputation.
All users of your product are special.
Yes, they all have different needs, but meet those needs.

## Culture

DX is also about product vision.
It is something that should be in your development team.
It should become part of a culture.
Understand what you create.
Not from specifications but from the real users perspective.

Frontend developers are more product-oriented than backend developers.
They focus on users and their experience.
Backend developers focus on algorithms and data structures.
I know that there are backend developers who also think about their users.
This article is not about them.

> The product team and people who have vision should teach others to see problems from the real users perspective.
> If you would like to bring innovations and raise the quality of the product --- such thinking should become part of you.

## Bad DX examples

What experience should engineers avoid trying to use your application?
This is an opinionated short list of bad DX examples.
If you have something to add --- welcome to the comment section below.

### Bad API design

Take a look at the following:

```text
GET     /users
GET     /users?id={userID}
NEW     /users/create
POST    /users/update?id={userID}
DROP    /user/{userID}
```

Do you feel pain looking at this?
I do.

- It's a mix of different things
- Semantics are not followed
- Not easy to understand straight away what is happening
- Not standard HTTP methods are in use (but this is fine according to [RFC 2616](https://tools.ietf.org/html/rfc2616#section-9)).

What is good is that it works.
But it would be a lot better if it looked like this:

```text
GET       /users
GET       /users/{userID}
POST      /users
PUT       /users/{userID}
DELETE    /user/{userID}
```

Clean.
Without looking at documentation such API already starts to give clues.

Many frameworks ([Ruby on Rails](https://guides.rubyonrails.org/getting_started.html#getting-up-and-running), [Laravel](https://laravel.com/docs/7.x/controllers#resource-controllers), [Play](https://www.playframework.com/documentation/2.8.x/JavaRouting#HTTP-routing), etc.) suggest following design of REST APIs by default.
Actually, Roy Thomas Fielding was the first who [proposed REST](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm).
To start developing taste in API design take a look at [this resource](https://restfulapi.net/rest-api-design-tutorial-with-example/) or [this article](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/) to get started.

Another thing that I would like to mention is deep nested objects in API responses.
Objects are trees and sometimes those trees grow like real trees.
Very tall and dense.
It is not good when your response object looks like this:

```json
{
  "id": "001",
  "value": "some value",
  "child": [
    {
      "id": "002",
      "value": "another value",
      "child": [
        { ... }
      ]
    }
  ]
}
```

To get needed values you need to traverse a graph.
Algorithmic complexity to parse a graph is `O(V+E)` ([DFS](https://en.wikipedia.org/wiki/Depth-first_search)).
And it's a lot.
There might be too many nodes to traverse.
It would be better to flatten such object.

```json
[
  {
    "id": "001",
    "value": "some value"
  },
  {
    "id": "001:002",
    "value": "another value",
  },
  {
    "id": "001:002:xxx",
    "value": "and another value",
  }
]
```

Much better.
And this might be a final variant if the return object is small.
Parsing the following structure will take `O(n)` (because of one loop).
Nice.
And reading such structure is easier.
Is it possible to lower search to `O(1)`?

```json
{
  "001": {
    "id": "001",
    "value": "some value"
  },
  "001:002": {
    "id": "001:002",
    "value": "another value",
  },
  "001:002:xxx": {
    "id": "001:002:xxx",
    "value": "and another value",
  }
}
```

Now it is `O(1)`.
You can specify a key and extract value without iterating an object.
Some may recall Redux [State Shape Normalization](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) by looking at the last example.

> **TIP:** Use the following approach to store objects under keys in cache.

Solutions provided here are not silver bullets.
Key takeaway:

> Keep your objects as flat as possible.

Take a look at your APIs.
Can somebody's life be simplified?

### Configuration properties chaos

Sometimes configuration properties are treated not seriously.
Take a look at this snippet:

```ini
base.url=http://localhost:8080
port=1313
jobs.disabled=true
extract.values.and.save.period.hours=5
send.email.each.12.hours=true
```

- Naming is strange and hard to read
- Hard to follow logic (because there is no logic)
- Time unit is big.
It might be that there are properties set in other time units than hours.
- It's hard to figure out the meaning of some properties by their names
- etc.

> Treat configuration properties as first-class citizens.

Developers and Ops interact with your application using properties.
If it is not clear how to use them --- mistakes may arise.
Additionally it is a sign about the bad quality of your product.

How to fix this?

```ini
# Network address (server.address) to which the server should bind
# and listen port for incoming HTTP requests (server.port).
# Default:
server.address=127.0.0.1
server.port=80

# Job to extract and save reports to storage.
# If enabled (jobs.extract_reports.enabled) job will
# run every 5 hours (jobs.extract_reports.interval in seconds) and save
# reports to defined destination (jobs.extract_reports.destination).
#
# Enable email notifications
# (jobs.extract_reports.email_notifications) to send summary
# of jobs done during the day.
# Default:
jobs.extract_reports.enabled=false
jobs.extract_reports.interval=18000
jobs.extract_reports.destination=/tmp/reports
jobs.extract_reports.email_notifications=false
```

- Comments added --- more context given
- Sensible defaults are set
- All properties are logically grouped
- Application with set defaults will be able to start without extra configuration

For inspiration I would recommend to take a look at:

- [redis.conf](http://download.redis.io/redis-stable/redis.conf)
- [postgresql.conf](https://github.com/postgres/postgres/blob/master/src/backend/utils/misc/postgresql.conf.sample)

### Logs with no meaning and action

Logs are the main interface of your app for the Ops team.

> If logs lack context it might lead to long investigations of a problem.

```txt
[12:40:45] ERROR Exception happened
com.ekiras.exception.BaseException: Base Exception
at com.ekiras.controller.HomeController.ex1(HomeController.java:21) ~[bin/:na]
at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:1.8.0_45]
...
at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:893) ~[spring-webmvc-4.2.4.RELEASE.jar:4.2.4.RELEASE]
at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:969) [spring-webmvc-4.2.4.RELEASE.jar:4.2.4.RELEASE]
at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:860) [spring-webmvc-4.2.4.RELEASE.jar:4.2.4.RELEASE]
at javax.servlet.http.HttpServlet.service(HttpServlet.java:622) [tomcat-embed-core-8.0.30.jar:8.0.30]
...
```

Such a log only states that something bad happened.
For those who don't have access to the code of your app this is almost zero information.
Stacktrace will not give information on how to solve the issue.

```txt
[12:40:45] ERROR Connection to the database (db.internal/app) failed. Check datasource property in application configuration
```

The message above is clearer because it states directly:

1. What is the problem --- DB connection failed
1. How this error can be fixed --- check `datasource` property

Usually, machines collect logs first and after humans read them.
If this is the case, write log in JSON or structured text formats:

```txt
time="2020-06-14T01:27:38-04:00" level=error msg="Connection to the database (db.internal/app) failed. Check datasource property in application configuration" status_code=500 path="/about"
```

With the example above, logs can have more context like response status code and path that failed.
The following format is readable by machines and by humans.
Rule of thumb:

> One event equals one log line.

### No comments in code

When you want to use some method from the library and it doesn't have a description --- it's a problem.

```java
public List<User> users(Bool limit, String group, String sort) {
  // ...
}
```

Guess games, anyone?
The assumption is that it will return the list of users.
But what is `limit`, `group` and `sort`?
What are their values?
What can be set there?

Without comments we need to read code to understand what is happening there.
After reading open Pull Request with the following comment:

```java
/**
 * Return list of users.
 *
 * @param limit specifies to get users with limited access (default: true)
 * @param group user group to lookup (default: "regular")
 * @param sort  how to sort users (default: "asc"; possible values: "asc", "desc")
 * @return      list of users
 */
public List<User> users(Boolean limit, String group, String sort) {
  // ...
}
```

Congratulations!
You've got angry developers who spent a lot of time understanding code that they should not even know.

[Go](https://golang.org) is playing this game by [making comments mandatory](https://golang.org/doc/effective_go.html#commentary).
And another player is [Rust](https://www.rust-lang.org), who go with [documentation comments as tests](hhttps://doc.rust-lang.org/1.44.0/book/ch14-02-publishing-to-crates-io.html#documentation-comments-as-tests) approach.

> Self-documenting code is a myth.

Document your code.
Users and the future self will be very grateful for such effort.

### Unpredictable responses

For example, you want to get a list of prices set for some item in the shop during the specified day.
API response might look following:

```json
{
  "item": "78956745",
  "day": "2020-06-14",
  "prices": [
    "8,72",
    "9,01",
    "8,02"
  ]
}
```

What if there were no price changes during the day?
Item ID and day are valid.
The only thing missing is the list of prices.
Consider the following options:

1. Prices are returned as an empty list:

    ```json
    {
      "item": "78956745",
      "day": "2020-06-14",
      "prices": []
    }
    ```

1. Prices are not returned:

    ```json
    {
      "item": "78956745",
      "day": "2020-06-14",
    }
    ```

1. Prices are set to null:

    ```json
    {
      "item": "78956745",
      "day": "2020-06-14",
      "prices": null
    }
    ```

Two last options are not predictable.
Option 2 modifies response by removing `prices` object from the response.
Not good.
Option 3 makes it worse.
You saw that in response there is a list and now you observe different type.

The best approach is to go with Option 1.
You know that `prices` is a list.
In future, you also expect that there will be a list.
If there is no information, then return an empty list.
Less confusion and meet expectations.

### Only once executed configuration properties

You can give an option to the user to configure your service via configuration files or APIs.
In some scenarios, this does make sense.
But sometimes there is a case when configuration in a file is used only once to bootstrap an app.
And then only the API is in use.

Don’t do that.
If you provide both options --- both of them should work the same way.
Do change in file --- changes apply.
Do changes via API --- changes apply.

> Configuration operations that users do should be [idempotent](https://en.wikipedia.org/wiki/Idempotence).

It doesn’t matter how you set configuration —-- it should always work the same way.

## How to level-up DX

It's all about thinking.
And thinking is something not easy to change.
I would suggest to start with [The Twelve-Factor methodology](https://12factor.net/).
It is a set of good practices to apply.
It's more oriented towards backend applications, but ideas can apply to other areas as well.
Take a look at [Stripe](https://stripe.com/) for inspiration.
This is one of the companies that is known for great DX.
Another company that I like and it inspires is [Digital Ocean](https://www.digitalocean.com).
Also suggest to read fresh and nice article from Chris Coyer [about meaning of DX for different people](https://css-tricks.com/what-is-developer-experience-dx/).
Are you building CLI?
Get inspiration from Carolyn Van Slyck talk on [how to design Command-Line tools that people love](https://www.youtube.com/watch?v=eMz0vni6PAw).

And ask yourself questions:

- Who are end users / stakeholders? Is it another team? Other developers who perform integrations?
- How will this library be used?
- Can this be simplified?
- Is this readable and understandable?
- Does it look simple?
- Will my colleagues understand this?

> And ask for feedback to become even better.

Hope you enjoyed it.
Happy coding and nice mood!
