
var uuid = require('node-uuid');
var aws_lambda = require('aws-services-lib/aws_promise/lambda.js');
var accountFinder = require('./account_finder');
var alarms = require('./alarms');
var metrics = new (require('./metrics'))();

exports.handler = function (event, context) {

  console.log(JSON.stringify(event));
  var localRegion = event.region;
  console.log("localRegion = " + localRegion);
  var remoteRegion = 'us-east-1';

  //var federateAccount = process.env.FEDERATE_ACCOUNT;
  //var federateRoleName = process.env.FEDERATE_ACCOUNT_ROLE_NAME;
  //var masterBillingAccount = process.env.MASTER_BILLING_ACCOUNT;
  //var roleName = process.env.MASTER_BILLING_ACCOUNT_ROLE_NAME;
  //var roleExternalId = process.env.MASTER_BILLING_ACCOUNT_ROLE_EXTERNAL_ID;
  var threshold = process.env.THRESHOLD_FOR_ALARMS;
  var topicArn = process.env.TOPIC_ARN_FOR_ALARMS;
  //var sessionName = uuid.v4();
  //var durationSeconds = 0;

  /*var roles = [];
  roles.push({roleArn:'arn:aws:iam::' + federateAccount + ':role/' + federateRoleName});
  var admin_role = {roleArn:'arn:aws:iam::' + masterBillingAccount + ':role/' + roleName};
  if (roleExternalId) {
    admin_role.externalId = roleExternalId;
  }
  roles.push(admin_role);
  console.log(roles);

  // first find all the consolidated accounts
  var fedParams = {
    region: remoteRegion,
    roles: roles,
    sessionName: sessionName,
    durationSeconds: durationSeconds,
    fedFunctionName: process.env.FEDERATION_FUNCTION_NAME
  }*/
  var remoteCreds = null;
  /*aws_lambda.federate(fedParams).then(function(creds) {
    console.log(creds);
    remoteCreds = creds;
    return accountFinder.find({region:remoteRegion, credentials:creds});*/
  accountFinder.find({region:remoteRegion}).then(function(billingAccounts) {
    return billingAccounts;
  }).then(function(billingAccounts) {
    console.log(billingAccounts);
    // setup alarms if not exist for each billing account
    var promises = [];
    billingAccounts.forEach(function(account) {
      var alarmParams = {
        region: localRegion,
        accountId: account,
        topicArn: topicArn,
        threshold: threshold
      }
      promises.push(alarms.setup(alarmParams));
    });
    return Promise.all(promises).then(function(retArray) {
      return billingAccounts;
    }).catch(function(err) {
      context.fail(err);
    });
  }).then(function(billingAccounts) {
    var current = new Date();
    addMetricData(0, billingAccounts, remoteCreds, localRegion, remoteRegion, current, function(err, data) {
      if(err) {
        context.fail(err, null);
      }
      else {
        console.log('completed to add metrics in all account');
        context.done(null, data);
      }
    });
  }).catch(function(err) {
    context.fail(err);
  })
}

function addMetricData(idx, billingAccounts, creds, localRegion, remoteRegion, current, callback) {
  var billingAccount = billingAccounts[idx];
  metrics.addMetricData(billingAccount, creds, localRegion, remoteRegion, current, function(err, data) {
    if(err) {
      console.log("failed to add metrics in account[" + billingAccount + "] : " + err);
      callback(err, null);
    }
    else {
      if (!data) {
        console.log('no estimated charges metrics found in account[' + billingAccount + ']');
      }
      else {
        console.log('completed to add metrics in account[' + billingAccount + ']');
      }
      if (++idx == billingAccounts.length) {
        callback(null, true);
      }
      else {
        addMetricData(idx, billingAccounts, creds, localRegion, remoteRegion, current, callback);
      }
    }
  });
};
