
var AWS = require('aws-sdk');

module.exports = {

  find: function(params) {
    var cloudwatch = new AWS.CloudWatch(params);
    params = {
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      NextToken: null
    };
    var accounts = [];
    return add(cloudwatch, params, accounts).then(function(data) {
      console.log(data);
      AWS.config.credentials = null;
      return data;
    });
  }
}

function add(cloudwatch, params, accounts) {
  console.log(params);
  return cloudwatch.listMetrics(params).promise().then(function(data) {
    data.Metrics.forEach(function(metrics) {
      //console.log(JSON.stringify(metrics.Dimensions));
      var accountDimensions = metrics.Dimensions.filter(function(dim) {
        return dim.Name == "LinkedAccount";
      })
      console.log(accountDimensions);
      if (accountDimensions.length > 0 && accounts.indexOf(accountDimensions[0].Value) < 0) {
        accounts.push(accountDimensions[0].Value);
      }
    });
    return data.NextToken;
  }).then(function(nextToken) {
    console.log("nextToken: " + nextToken);
    if (nextToken) {
      params.NextToken = nextToken;
      return add(cloudwatch, params, accounts);
    }
    else {
      return accounts;
    }
  });
}
