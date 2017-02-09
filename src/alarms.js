
var AWS = require('aws-sdk');

module.exports = {

  setup: function(params) {
    var self = this;
    console.log(params);
    return self.find(params).then(function(data) {
      console.log(data);
      if (data.MetricAlarms.length == 0) {
        console.log("No alarm found for account " + params.accountId);
        return self.add(params);
      }
      else {
        console.log("Alarm found for account " + params.accountId + ", so just return");
        Promise.resolve(true);
      }
    }).catch(function(err) {
      throw err;
    });
  },

  find: function(params) {
    var cloudwatch = new AWS.CloudWatch({region:params.region});
    var input = {
      MetricName: 'IncreasedPercentages',
      Namespace: 'CTOBilling',
      Dimensions: [
        {
          Name: 'LinkedAccount',
          Value: params.accountId
        }
      ],
      Unit: 'Percent'
    };
    return cloudwatch.describeAlarmsForMetric(input).promise();
    /*
    { ResponseMetadata: { RequestId: '1b97dfdd-ee6e-11e6-86be-fd25241a476c' },
      MetricAlarms:
      [ {
        AlarmName: '089476987273-OverIncreasedPercentagesAlarm',
        AlarmArn: 'arn:aws:cloudwatch:us-east-1:089476987273:alarm:089476987273-OverIncreasedPercentagesAlarm',
        AlarmDescription: 'Alerted whenever the linked account\'s IncreasedPercentages[Sim] metric has new data.',
        AlarmConfigurationUpdatedTimestamp: Wed Feb 08 2017 20:16:47 GMT-0600 (CST),
        ActionsEnabled: true,
        OKActions: [],
        AlarmActions: [Object],
        InsufficientDataActions: [],
        StateValue: 'INSUFFICIENT_DATA',
        StateReason: 'Unchecked: Initial alarm creation',
        StateUpdatedTimestamp: Wed Feb 08 2017 20:16:47 GMT-0600 (CST),
        MetricName: 'IncreasedPercentages',
        Namespace: 'CTOBilling',
        Statistic: 'Maximum',
        Dimensions: [Object],
        Period: 60,
        Unit: 'Percent',
        EvaluationPeriods: 1,
        Threshold: 10,
        ComparisonOperator: 'GreaterThanThreshold'
      }]
    }
    */
  },

  add: function(params) {
    var input = {
      AlarmName: params.accountId + '-OverIncreasedPercentagesAlarm',
      ComparisonOperator: 'GreaterThanThreshold',
      EvaluationPeriods: 1,
      MetricName: 'IncreasedPercentages',
      Namespace: 'CTOBilling',
      Period: 60,
      Threshold: params.threshold,
      ActionsEnabled: true,
      AlarmActions: [
        params.topicArn
      ],
      AlarmDescription: "Alerted whenever the linked account's IncreasedPercentages metric value is greater then threshold.",
      Dimensions: [
        {
          Name: 'LinkedAccount',
          Value: params.accountId
        }
      ],
      //ExtendedStatistic: 'STRING_VALUE',
      InsufficientDataActions: [
      ],
      OKActions: [
      ],
      Statistic: 'Maximum',
      Unit: 'Percent'
    };
    var cloudwatch = new AWS.CloudWatch({region:params.region});
    return cloudwatch.putMetricAlarm(input).promise();
  }
}
