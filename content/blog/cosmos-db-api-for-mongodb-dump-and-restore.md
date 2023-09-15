---
title: "Cosmos DB API for MongoDB dump and restore"
description: >
  Ever wondered if you can perform an offline migration from one Cosmos DB API for MongoDB to another using native MongoDB database tools?
  It's not only possible, but I'll walk you through the process step by step.
  Let's get started.
date: 2023-09-15T10:00:00+03:00
blog/categories:
  - How tos
blog/tags:
  - Azure
  - Azure Cosmos DB
---

Microsoft offers a [tutorial on how to perform an offline migration of MongoDB to Cosmos DB API for MongoDB](https://learn.microsoft.com/en--usernames/azure/cosmos-db/mongodb/tutorial-mongotools-cosmos-db#mongodumpmongorestore) using native [MongoDB database tools](https://www.mongodb.com/docs/database-tools/).
However, I found that the steps provided in the tutorial didn't work for me.
After some experimentation with different options and commands, I finally succeeded in the migration process.

As of the time of writing, I used the following tool versions:

```bash
mongo --version
MongoDB shell version v3.6.7

mongodump --version
mongodump version: 100.8.0

mongorestore --version
mongorestore version: 100.8.0
```

Below, I'll walk you through the process of dumping and restoring a MongoDB database.
This method also applies when you're migrating from Cosmos DB API for MongoDB to another Cosmos DB API for MongoDB instance.

> **Note:** Before starting the restore process on your Cosmos DB account, ensure that the "Retryable writes" feature and access key metadata writes are enabled.
> You can safely return this feature to its previous state after the restore.

## Step 1: Dump Your MongoDB Database

First, you need to dump your MongoDB database. Replace `src_uri` with the full connection string for your Cosmos DB API for MongoDB or MongoDB instance.

```bash
#!/bin/bash

src_uri=  # Full Cosmos DB API for Mongo DB or Mongo DB
          # connection string

mongodump \
  --numParallelCollections 1 \
  --out dump \
  $src_uri
```

## Step 2: Restore Your MongoDB database to Cosmos DB

Next, you'll restore your database to Cosmos DB API for MongoDB.
Replace `target_user`, `target_pswd`, `target_db`, and `target_uri` with your target Cosmos DB API for MongoDB credentials and details.

```bash
#!/bin/bash

target_user= # Target Cosmos DB API for Mongo DB user
target_pswd= # Target Cosmos DB API for Mongo DB password
target_db=   # Target Cosmos DB API for Mongo DB database name
target_uri=  # Target Cosmos DB API for Mongo DB hostname and port

mongo \
  --ssl \
  --authenticationDatabase admin \
  --username $target_user \
  --password $target_pswd \
  --eval 'db.dropDatabase()' \
  $target_uri/$target_db

mongorestore \
  --host $target_uri \
  --authenticationDatabase admin \
  --username $target_user \
  --password $target_pswd \
  --ssl \
  --nsInclude "*" \
  --maintainInsertionOrder \
  --numParallelCollections 1 \
  dump
```

That's it!
You've successfully migrated your MongoDB database to Azure Cosmos DB API for MongoDB.
