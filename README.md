
# Billing Dashboard

Billing Dashboard Service.
Deployed in the master billing account.

After deployed
1. Encrypt the Env variable, RedshiftPass, of 2 new Lamdba functions using the newly created key in Lambda Console
2. Need to setup AWS Cost & Usage Report
  https://aws.amazon.com/blogs/aws/new-upload-aws-cost-usage-reports-to-redshift-and-quicksight/

![aws-services][aws-services-image]

## How To Setup

    $ AWS CodePipeline, 'aws-services-billing'


## How To Update Lambda Function Codes

    $ ./run_update_codes


## How To Test Lambda Functions

    $ cd tests
    $ node test_xxx.js

[aws-services-image]: ./docs/images/logo.png?raw=true
