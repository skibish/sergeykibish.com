---
title: "Setting Up a Terraform Pipeline in Azure DevOps"
description: >
  Are you ready to automate your Terraform deployments using Azure DevOps?
  In this short post, I'll walk you through creating a Terraform pipeline using Azure YAML Pipelines.
date: 2023-09-16T10:16:03+03:00
blog/categories:
  - How tos
blog/tags:
  - Azure
  - Azure DevOps
  - DevOps
  - Terraform
---

Are you ready to automate your Terraform deployments using Azure DevOps?
In this short post, I'll walk you through creating a Terraform pipeline using Azure YAML Pipelines.

## Directory Structure

Before we dive into the pipeline setup, make sure your project follows this directory structure:

```txt
.
└── dev
```

Each folder is a separate environment the state of which we would like to track.

Now, let's explore the steps of our Azure YAML Terraform pipeline:

## Step 1: Terraform Version Configuration

To begin, it is important to ensure that the correct Terraform version is in use.
This step is essential for maintaining consistency.

## Step 2: Initializing Terraform and Creating a Plan

In this phase, we initialize Terraform and create an execution plan.
The plan outlines the changes Terraform intends to make to your infrastructure.

## Step 3: Manual Validation

You want to manually review Terraform plan and approve changes before applying them.
This step allows for such validation.

## Step 4: Applying the Terraform Plan

When you're confident in your changes, it's time to apply the Terraform plan.
This action executes the planned infrastructure updates.

## Customization Tip

Feel free to adapt this pipeline to your specific workflow.
For instance, you can add conditions to ensure it runs exclusively from the `main` branch of your version control system.

## Pipeline Best Practices

While you might be tempted to optimize the pipeline for efficiency (reducing repetition), it's often better to prioritize simplicity and readability.
Yes, there may be some repetition in the pipeline, but this simplicity is invaluable when troubleshooting issues.
It's much easier to skim through one file than to search through multiple templates to find the source of a problem.

For a concrete example of this pipeline see below:

```yaml
trigger: none

parameters:
- name: environment
  type: string
  values:
  - dev

variables:
  - name: terraform_version
    value: "1.5.5"
  - name: terraform_sha
    value: "ad0c696c870c8525357b5127680cd79c0bdf58179af9acd091d43b1d6482da4a"
  - ${{ if eq(parameters.environment, 'dev') }}
    - name: storage_account_name
      value: ""
    - name: storage_account_resource_group_name
      value: ""
    - name: service_connection_name
      value: ""

name: ${{ parameters.environment }}_$(Date:yyyyMMdd).$(Rev:r)

pool: ubuntu-latest

jobs:
- job: terraform_plan
  displayName: "Terraform Plan"
  steps:
  - checkout: self
    fetchDepth: 1

  - bash: |
      curl -SL "https://releases.hashicorp.com/terraform/$(terraform_version)/terraform_$(terraform_version)_linux_amd64.zip" --output terraform.zip
      echo "$(terraform_sha) terraform.zip" | sha256sum -c -
      unzip terraform.zip
      chmod +x terraform
      ./terraform --version
      rm terraform.zip
    displayName: download terraform of specific version
    workingDirectory: ${{ parameters.environment }}

  - task: AzureCLI@2
    displayName: terraform init and plan
    inputs:
      azureSubscription: $(service_connection_name)
      addSpnToEnvironment: true
      scriptLocation: inlineScript
      inlineScript: |
        export ARM_CLIENT_ID=$servicePrincipalId
        export ARM_CLIENT_SECRET=$servicePrincipalKey
        export ARM_TENANT_ID=$tenantId
        export ARM_SUBSCRIPTION_ID=$(az account show --query 'id' --output tsv)
        export ARM_SKIP_PROVIDER_REGISTRATION=true

        ./terraform init \
          -backend-config="storage_account_name=$(storage_account_name)" \
          -backend-config="container_name=terraform-state" \
          -backend-config="key=${{ parameters.environment }}.tfstate" \
          -backend-config="resource_group_name=$(storage_account_resource_group_name)"

        ./terraform plan -input=false -out plan.tf
      workingDirectory: ${{ parameters.environment }}

  - task: PublishPipelineArtifact@1
    inputs:
      targetPath: terraform
      artifactType: pipeline
      artifactName: plan

- job: validation
  displayName: Validate Plan
  pool: server
  dependsOn: terraform_plan
  steps:
  - task: ManualValidation@0
    timeoutInMinutes: 30
    inputs:
      notifyUsers: |
        $(Build.RequestForEmail)
      instructions: |
        Review Terraform plan
      onTimeout: reject

- job: terraform_apply
  displayName: Terraform Apply
  dependsOn: validation
  steps:
  - checkout: none

  - task: DownloadPipelineArtifact@1
    inputs:
      buildType: current
      artifactName: plan
      targetPath: $(System.DefaultWorkingDirectory)
    displayName: download plan artifact

  - task: AzureCLI@2
    displayName: terraform apply
    inputs:
      azureSubscription: $(service_connection_name)
      addSpnToEnvironment: true
      scriptLocation: inlineScript
      inlineScript: |
        export ARM_CLIENT_ID=$servicePrincipalId
        export ARM_CLIENT_SECRET=$servicePrincipalKey
        export ARM_TENANT_ID=$tenantId
        export ARM_SUBSCRIPTION_ID=$(az account show --query 'id' --output tsv)
        export ARM_SKIP_PROVIDER_REGISTRATION=true

        chmod -R +x .terraform/providers
        chmod +x terraform

        ./terraform apply -input=false plan.tf
    workingDirectory: ${{ parameters.environment }}
```
