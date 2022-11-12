---
title: "Saving Test Results from the Kubernetes Job"
description: >
  At some point in life you might find yourself running E2E (end-to-end) test suite using Kubernetes cluster.
  Such tests are relatively short living processes (they born to run the test and die when are finished).
  The question is: How to get the generated test report from the container in Kubernetes?
date: 2022-08-01T06:00:00+03:00
blog/categories:
  - How tos
blog/tags:
  - Docker
  - Kubernetes
  - DevOps
---

At some point in life you might find yourself running E2E (end-to-end) test suite using Kubernetes.
Such tests are relatively short living processes (born to run the tests and die when they are finished).

Let's capture what we want to achieve:

1. Run tests in Kubernetes cluster
1. Collect results
1. Remove test runner from the cluster
1. Publish the results

In Kubernetes world processes which should not be run forever are called [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/).
And we will use Jobs to achieve our goals.

## Running tests

Configuration for the job would look like the following:

```yaml
# job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: e2e-test-0001
spec:
  backoffLimit: 0
  ttlSecondsAfterFinished: 0
  template:
    spec:
      containers:
      - name: e2e-test-0001
        image: alpine
        command: ["npm",  "run", "test"]
      restartPolicy: Never
```

Key properties to note:

- `restartPolicy: Never` --- if execution failed, do not restart the container
- `backoffLimit: 0` --- do not retry the job, fail fast
- `ttlSecondsAfterFinished: 0` --- remove the job right after it's finished

With this configuration when tests complete, job will be removed from the cluster.

## Collecting results

Before going further, let's assume that our test runner produces `junit.xml` file when tests are finished.
Pipeline knows how to process the `junit.xml` file to show beautiful report.
We somehow need to get the report from the container.
The following options crossed my mind:

1. Save the report to some blob storage when runner is finished.
Download it and give it to the pipeline.
1. Mount volume and write report there.
Spin another container, mount volume there, download report, clean everything.
1. Parse `junit.xml` file and upload it directly to the API

All of the options above require some additional complicated logic.
In Option 1 it is required to write some additional script which will upload blob to storage, then another script to download it in the pipeline.
Also we should not forget about connection configuration, permissions and other fun stuff.

Option 2 is not better.
Yes, maybe we will not face the infra configuration complexities but in addition to the job we need to create the volume.
How many there should be?
On each node?
In which one the file will be?
How to figure this out?

Too much questions...

Option 3 requires additional work again because, usually, APIs do not work with raw junit files.
Script is needed to parse and upload the result.
We need to think how to pass the API key or something similar to allow our script to upload the file.
Highly likely it will be not a simple task because there is a high probability that egress firewall rules are present to deny such calls.

### Let's take a pause and think

Okay.
If Docker were used locally how that report would be extracted?

Somehow like this:

```bash
# Run the tests.
# Because container is not run as daemon,
# execution of script is blocked here (waiting for command to finish).
CONTAINER_NAME=e2e-test-0001
docker run --name $CONTAINER_NAME

# Whether tests ended successfully or not,
# container is present on the machine.
# `junit.xml` can be copied from it to the desired location.
docker cp $CONTAINER_NAME:/junit.xml .

# Always clean-up after yourself.
# Remove the container.
docker rm $CONTAINER_NAME
```

Dope.
But is it possible to achieve something like this in Kubernetes?
Meaning, no integrations with anything, just go and grab the generated file?

### Back to Kubernetes

Unfortunately, no.

Kubernetes is a scheduler.
`kubectl` does not wait for something to finish.
It just accepts the declaration (what is required) and tries to apply it.
Its job is to put workload somewhere, start it and then make sure that it stays in the requested state.

Another problem is that commands like `kubectl cp` or `kubectl exec` only work when container is still running in comparison to native Docker approach.

Idea of grabbing the file from the container inspired by Docker approach is very appealing.
What if we will do the following:

1. Run tests and keep container alive for a little bit longer
1. Wait till `junit.xml` is generated
1. Save it and pass to publishing task in the pipeline

Job definition to wait a little bit longer might look like this:

```yaml
# job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: e2e-test-0001
spec:
  backoffLimit: 0
  ttlSecondsAfterFinished: 0
  template:
    spec:
      containers:
      - name: e2e-test-0001
        image: alpine
        command: ["/bin/sh", "-c", "sleep 3; echo test_finished_report_generated > junit.xml; sleep 100"]
      restartPolicy: Never
```

The script which implements the idea:

```bash
JOB_NAME=e2e-test-0001

# kick-off test job
kubectl apply -f job.yaml

# wait for the moment when junit.xml
# file will become available
testCode=1
while [ "$testCode" -eq "1" ]
do
  echo "checking that junit.xml has been generated..."
  kubectl exec job.batch/$JOB_NAME -- test -f junit.xml
  testCode=$?
  sleep 3
done

echo "saving junit.xml"
kubectl exec job.batch/$JOB_NAME -- cat /junit.xml > junit.xml
cat junit.xml
```

This implementation requires that built container would have some basic unix tools.
In this case `sleep`, `test` and `cut`.
So, with [distroless](https://github.com/GoogleContainerTools/distroless) containers this solution will not work.

The core idea here is to keep container alive with help of `sleep` to execute `kubectl exec` commands successfully.
Nothing extra.

## Summary

Maybe not the most elegant solution but it's the simplest way I've currently found and it gets the job done.
Script can be handled by the pipeline, adding `sleep 100` can be part of the job container definition command or as part of test runner command (e.g. `npm run test`).

To not stay in the loop forever you can think about adding some limits or more sophisticated solution like [retry with exponential backoff](https://docs.aws.amazon.com/general/latest/gr/api-retries.html).
