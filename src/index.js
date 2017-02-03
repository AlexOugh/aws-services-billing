'use strict';
console.log('Loading function');

var auth = require('./authorizer');

exports.handler = (event, context) => {

  console.log('Received event:', JSON.stringify(event, null, 2));

  var method = event.httpMethod;
  var paths = event.path.split('/');
  var path = paths[paths.length-1];
  var headers = event.headers;
  var queryParams = event.queryStringParameters;
  var postData = (event.body) ? JSON.parse(event.body) : null;

  var controller = null;
  var params = null;
  if (postData && postData.sql) {
    controller = require('./sql_controller');
    params = postData;
  }
  else {
    controller = require('./billing_controller');
    params = queryParams;
  }
  // run the method
  const action = method.toLowerCase();
  console.log(action);
  controller[action](params).then(data => {
    console.log(data);
    sendSuccessResponse(data, context);
  }).catch(err => {
    console.log(err);
    sendFailureResponse({error: err}, 500, context);
  });
}

function sendNotPermittedMethodResponse(path, method, context) {
  var responseBody = {error: "not permitted method " + method + " in " + path};
  var statusCode = 404;
  sendResponse(responseBody, statusCode, context);
}

function sendNotFoundResponse(path, method, context) {
  var responseBody = {error: "invalid path " + path};
  var statusCode = 404;
  sendResponse(responseBody, statusCode, context);
}

function sendSuccessResponse(retValue, context) {
  var responseBody = retValue;
  var statusCode = 200;
  sendResponse(responseBody, statusCode, context);
}

function sendFailureResponse(err, statusCode, context) {
  var responseBody = err;
  sendResponse(responseBody, statusCode, context);
}

function sendResponse(responseBody, statusCode, context) {
  var response = {
      statusCode: statusCode,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(responseBody)
  };
  console.log("response: " + JSON.stringify(response))
  context.succeed(response);
}
