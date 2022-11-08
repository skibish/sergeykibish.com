---
title: "Removing Spring Boot Actuator and GRPC health check requests from App Insights"
description: >
  When App Insights Java agent is added to the Spring Boot application with Actuator liveness / readiness endpoints enabled,
  it will log all probe requests done by Kubernetes to App Insights.
  Luckily, there is an option now to remove those logs without touching the application code.
date: 2022-11-09T06:00:00+02:00
blog/categories:
  - How tos
blog/tags:
  - Azure
  - Azure Application Insights
---

When [App Insights Java agent](https://github.com/microsoft/ApplicationInsights-Java) is added to the Spring Boot application with Actuator liveness / readiness endpoints enabled, it will log all probe requests done by Kubernetes to App Insights.
This is a lot of unneeded noise in the logs.

Luckily, starting from version `3.0.3` it is possible to add [sampling overrides](https://learn.microsoft.com/en-us/azure/azure-monitor/app/java-standalone-sampling-overrides) without touching the application code.
Note that at the moment of writing this feature is still in the preview.
Configuration shown is for App Insights version `3.4.2`.

In `applicationinsights.json` add the following to remove all requests to actuator endpoints:

```json
{
  "preview": {
    "sampling": {
      "overrides": [
        {
          "telemetryType": "request",
          "percentage": 0,
          "attributes": [
            {
              "key": "http.url",
              "value": ".*/actuator/health/.*",
              "matchType": "regexp"
            }
          ],
        }
      ]
    }
  }
}
```

The regular expression `https?://[^/]+/actuator/health/.*` for some reason didn't worked for me.

In my case I also needed to remove health checks to the GRPC Health service.
This can be achieved the following way:

```json
{
  "preview": {
    "sampling": {
      "overrides": [
        {
          "telemetryType": "request",
          "percentage": 0,
          "attributes": [
            {
              "key": "rpc.service",
              "value": "grpc.health.v1.Health",
              "matchType": "strict"
            }
          ],
        }
      ]
    }
  }
}
```

Override attributes list works as `AND` operator (if condition matches *for all attributes specified*, only then apply override sampling).
Thus, if you want all logs removed and have one `applicationinsights.json` file, then override rules should be joined like so:

```json
{
  "preview": {
    "sampling": {
      "overrides": [
        {
          "telemetryType": "request",
          "percentage": 0,
          "attributes": [
            {
              "key": "http.url",
              "value": ".*/actuator/health/.*",
              "matchType": "regexp"
            }
          ],
        },
        {
          "telemetryType": "request",
          "percentage": 0,
          "attributes": [
            {
              "key": "rpc.service",
              "value": "grpc.health.v1.Health",
              "matchType": "strict"
            }
          ],
        }
      ]
    }
  }
}
```

Hope this helps!
