---
title: "Cosmos DB API for MongoDB vs Cosmos DB API for NoSQL vs MongoDB Atlas"
description: >
  Cosmos DB API for MongoDB or Cosmos DB API for NoSQL?
  Maybe MongoDB Atlas?
  This post might give you an answer if you need to quickly insert a lot of documents larger than 4KB and be flexible in querying.
date: 2023-07-03T09:00:00+03:00
blog/categories:
  - Observations
blog/tags:
  - Azure
  - Azure Cosmos DB
---

In January 2023, as part of the one project, I conducted several tests to compare three different NoSQL databases.
The purpose was to assess their performance and determine the most suitable option for future use.

The databases included in the test were:

| Database name             | Configuration                                              |
|---------------------------|------------------------------------------------------------|
| MongoDB Atlas M30         | Dedicated, M30 (32GB, 8GB RAM, 2v CPU); Azure (westeurope) |
| Cosmos DB API for MongoDB | Provisioned, 10K RU autoscaling container; Azure (westeurope) |
| Cosmos DB API for NoSQL   | Provisioned, 10K RU autoscaling container; Azure (westeurope) |

The application I worked on dealt with various JSON documents and has two primary requirements:

- Consumers can submit multiple documents at once, with a maximum of 1K documents per request.
The expectation is for these documents to be processed as quickly as possible.
- Consumers can read documents while applying various filtering and sorting rules.
The service should respond promptly.
On average, each "bucket" (partition) contains around 10K documents.

The main motivation behind conducting these tests was the disappointing performance of Cosmos DB API for MongoDB, which prompted the need to explore alternative options.

## Cosmos DB limitations

One of the limitations of Cosmos DB, when compared to MongoDB, is the requirement for a [mandatory index on a field that needs to be sorted](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/query/order-by#remarks).
This limitation posed a challenge for us, as one of our requirements was the ability to sort by *any* field.
To address this limitation, we had to resort to using a "Wildcard" index, which unfortunately has a negative impact on performance.

Another limitation is the concept of Request Units (RU).
In Cosmos DB, 1 RU represents 1KB for write operations.
Since our average document size is 4.5KB, each write operation consumes approximately 4 RUs, in addition to the RUs consumed by indexes.
It's important to note that a [Cosmos DB partition can handle a maximum of 10K RUs](https://learn.microsoft.com/en-us/azure/cosmos-db/concepts-limits#provisioned-throughput).
Therefore, in our case where a large number of documents need to be inserted into a single partition, the maximum throughput we can achieve is 10K RUs.
Setting a higher throughput would not make any difference in this scenario.

However, despite these limitations, we still wanted to compare the Cosmos DB APIs before exploring alternative solutions outside of Azure.
We were hopeful that a different API might better serve our needs, and we aimed to leverage as much as possible from Azure without venturing into external options.

## Testing approach

The testing approach was the following:

1. No frameworks, only drivers in use.
1. Generate 10K documents in memory so they would be the same across databases.
1. Average size of a document is 4.5KB.
1. Do insertions and read the documents from all databases listed above in one test scenario.
1. Measure execution time around driver insert and read commands.
1. Tests are executed one after another after a pause to reset the request limits.

## Building blocks

The tool which run the tests had the following building blocks:

- Kotlin 1.7.21
- Java 17
- `com.azure:azure-cosmos:4.39.0` (Async Client)
- `org.mongodb:mongodb-driver-reactivestreams:4.8.1` (Async Client)

Code is not present for now, maybe will be added later.
The important bit is what operations were used:

- MongoDB --- `insertMany`; `find` with `sort`, `limit`, `skip` and `allowDiskUse(true)`.
- Cosmos DB --- `executeBulkOperations`; `queryItems` with `SELECT`, `ORDER BY`, `OFFSET` and `LIMIT`.

## Environment

Code was executed from AKS cluster which was located in Azure (westeurope).
In the same region as three contestants.
No memory or CPU limits were set, VM type --- Standard_B4ms.
Code was executed as a Job in Kubernetes.

## Rules for all tests

There were rules applicable to our reality:

- IDs for the documents are client generated.
- By default, descending sort is done on created date time field.
- Writes are unordered.
- 10K generated documents are assigned to the same partition.

## Results

Let's take a look at the numbers.
"Index" column indicates what index rules where set:

- "No" --- no indexes (only default for `_id` is present).
- "Only needed" --- index on created date time and `a.b.c.d.e.f` field.
- "Wildcard" --- index on all document properties.

### Test Group 1, Insert

Inputs:

- 10K documents total.
- One insert has 1K documents.
- Insertions are done sequentially.

| DB                        | Time, average (ms) | Index       |
|---------------------------|-------------------:|------------:|
| Mongo Atlas M30           | 4,127              | No          |
| Mongo Atlas M30           | 4,232              | Only needed |
| Mongo Atlas M30           | 10,872             | Wildcard    |
| Cosmos DB API for MongoDB | 12,015             | Only needed |
| Cosmos API for NoSQL      | 15,605             | Only needed |
| Cosmos API for NoSQL      | 16,304             | Wildcard    |
| Cosmos DB API for MongoDB | 198,320            | Wildcard    |

### Test Group 2, Read

Inputs:

- 10K documents read.
- Read in pages of size 200.
- Reads are done sequentially.

| DB                        | Time, average (ms) | Index       |
|---------------------------|-------------------:|------------:|
| Mongo Atlas M30           | 10,600             | Only needed |
| Mongo Atlas M30           | 11,840             | No          |
| Cosmos DB API for NoSQL   | 14,618             | Only needed |
| Cosmos DB API for NoSQL   | 21,407             | Wildcard    |
| Mongo Atlas M30           | 23,859             | Wildcard    |
| Cosmos DB API for MongoDB | 78,674             | Wildcard    |
| Cosmos DB API for MongoDB | 81,251             | Only needed |

### Test Group 3, Read

Inputs:

- 10K documents read.
- Read in pages of size 1K.
- Reads are done sequentially.

| DB                        | Time, average (ms) | Index       |
|---------------------------|-------------------:|------------:|
| Cosmos DB API for NoSQL   | 5,806              | Only needed |
| Mongo Atlas M30           | 7,371              | Only needed |
| Mongo Atlas M30           | 7,689              | No          |
| Cosmos DB API for NoSQL   | 8,581              | Wildcard    |
| Mongo Atlas M30           | 17,811             | Wildcard    |
| Cosmos DB API for MongoDB | 71,197             | Wildcard    |
| Cosmos DB API for MongoDB | 77,275             | Only needed |

### Test 4, Read

Inputs:

- 10K documents read.
- Read in pages of size 200.
- Sort by deep field (e.g. `a.b.c.d.e.f`).
- Reads are done sequentially.

| DB                        | Time, average (ms) | Index       |
|---------------------------|-------------------:|------------:|
| Mongo Atlas M30           | 8,258              | Only needed |
| Mongo Atlas M30           | 9,638              | No          |
| Cosmos DB API for NoSQL   | 11,286             | Only needed |
| Cosmos DB API for NoSQL   | 16,278             | Wildcard    |
| Mongo Atlas M30           | 21,361             | Wildcard    |
| Cosmos DB API for MongoDB | 78,993             | Wildcard    |
| Cosmos DB API for MongoDB | 82,552             | Only needed |

### Test 5, Read

Inputs:

- 10K documents read.
- Read in pages of size 1K.
- Sort by deep field (e.g. `a.b.c.d.e.f`).
- Reads are done sequentially.

| DB                        | Time, average (ms) | Index       |
|---------------------------|-------------------:|------------:|
| Cosmos DB API for NoSQL   | 5,560              | Only needed |
| Mongo Atlas M30           | 6,500              | Only needed |
| Mongo Atlas M30           | 7,025              | No          |
| Cosmos DB API for NoSQL   | 8,196              | Wildcard    |
| Mongo Atlas M30           | 18,075             | Wildcard    |
| Cosmos DB API for MongoDB | 73,205             | Wildcard    |
| Cosmos DB API for MongoDB | 79,765             | Only needed |

## Summary

Based on the numbers collected, here is a summary and interpretation of the findings:

- Cosmos DB API for NoSQL performs faster than Cosmos DB API for MongoDB.
- In all insertion tests, including scenarios with no index, only necessary indexes, and wildcard index, MongoDB Atlas M30 outperforms both Cosmos APIs.
- In read tests, Cosmos DB API for NoSQL and MongoDB Atlas M30 show similar performance.
- MongoDB Atlas M30 without indexes performs on par or even better than Cosmos DB API for NoSQL with indexes.
- Among the tested databases, Cosmos DB API for MongoDB is the slowest.

In essence, the only similarity between Cosmos DB API for MongoDB and MongoDB itself is the name and some shared APIs.
For small applications with low loads and simple functionality, the differences between the two may not be significant.
However, for applications with higher demands as in our use case, Cosmos DB may not be the optimal choice.
