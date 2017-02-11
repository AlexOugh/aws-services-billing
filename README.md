
# Billing Dashboard & Alert System

Billing Dashboard Service to Provide Billing API Interfaces and Generate Billing Increased Percentage Metrics.

![aws-services][aws-services-image]

## How To Setup a CodePipeline

<a href="https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=ServerlessCodePipeline&amp;templateURL=https://s3.amazonaws.com/cloudformation-serverless-codepipeline.us-east-1/codepipeline.yaml"><img src="https://camo.githubusercontent.com/210bb3bfeebe0dd2b4db57ef83837273e1a51891/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f636c6f7564666f726d6174696f6e2d6578616d706c65732f636c6f7564666f726d6174696f6e2d6c61756e63682d737461636b2e706e67" alt="Launch Stack" data-canonical-src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png" /></a>

Input Parameter Values

- CloudformationLambdaExecutionRoleArn: *role_arn* (See <a href="https://s3.amazonaws.com/cloudformation-serverless-codepipeline.us-east-1/roles/role_cloudformation-lambda-execution-role.json">here</a> for Trust Relationships and Policy Document)
- CodePipelineServiceRoleArn: *role_arn*  (See <a href="https://s3.amazonaws.com/cloudformation-serverless-codepipeline.us-east-1/roles/role_AWS-CodePipeline-Service.json">here</a> for Trust Relationships and Policy Document)
- CustomAuthorizerIAMRoleName:*custom_authorizer_role_name*  (See <a href="https://s3.amazonaws.com/cloudformation-serverless-codepipeline.us-east-1/roles/role_apigateway-lambda-execution-role.json">here</a> for Trust Relationships and Policy Document)
- CustomAuthorizerLambdaName: *custom_authorizer_lambda_function_name* (See <a href="https://github.com/SungardAS/aws-services-authorizer">here</a> for the Lambda Function Project for Custom Authorizer)
- EncryptionLambdaName: *encryption_lambda_function_name* (See <a href="https://github.com/SungardAS/aws-services-encryption">here</a> for the Lambda Function Project to Encrypt Environment Variables)
- GitHubPersonalAccessToken: *access_token* (See <a href="https://help.github.com/articles/creating-an-access-token-for-command-line-use/">here</a> to find how to genernate the access token)
- GitHubSourceRepositoryBranch: master
- GitHubSourceRepositoryName: aws-services-billing
- GitHubSourceRepositoryOwner: SungardAS
- ParameterOverrides: { "VPCCidrBlock": "10.6.0.0/16", "SubnetCidrBlock1": "10.6.0.0/24", "SubnetCidrBlock2": "10.6.1.0/24", "NameTag": "redshift", "RedshiftUser": "billing", "RedshiftPass": "Sungard01", "RedshiftDatabase": "billing", "AlarmThresholdNumber": 10 }
- ProjectImage: aws/codebuild/nodejs:4.3.2

## How to Setup a Billing Report to Upload Billing Data to S3 Bucket & Redshift

The creation of this project stack will be started automatically once its Codepipline is successfully setup.

Follow steps in <a href="https://aws.amazon.com/blogs/aws/new-upload-aws-cost-usage-reports-to-redshift-and-quicksight/">here</a>.

  - Specify 'BillingDataUploadBucketName' value in the Output of the newly created this project stack for the S3 Bucket Name
  - Choose 'BucketServiceIAMRoleNameForRedshift' value in the Output of the newly created this project stack during "Manage IAM Roles"

Once the billing report is created in the S3 bucket, the billing data will be automatically imported to the Redshift.

## How To Test Lambda Functions

- $ cd tests
- Export necessary environment variables and fill the necessary input values
- $ node test_xxx.js

## [![Sungard Availability Services | Labs][labs-logo]][labs-github-url]

This project is maintained by the Labs group at [Sungard Availability
Services](http://sungardas.com)

GitHub: [https://sungardas.github.io](https://sungardas.github.io)

Blog:
[http://blog.sungardas.com/CTOLabs/](http://blog.sungardas.com/CTOLabs/)

[labs-github-url]: https://sungardas.github.io
[labs-logo]: https://raw.githubusercontent.com/SungardAS/repo-assets/master/images/logos/sungardas-labs-logo-small.png
[aws-services-image]: ./docs/images/logo.png?raw=true
