"use strict";
// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';

// require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION, apiVersion: "2012-08-10" });

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {

    AWS.config.update({ 
        dynamodb: { 
            endpoint: 'http://gradpath_db:8000' 
        } 
    })

    const docClient = new AWS.DynamoDB.DocumentClient();
    
    let response = {};
    const params = {
        TableName: 'Course',
        Item: {
            'id': '12345',
            'subject': 'CS',
            'course_code': '3000'
        }
    };

    console.log("Request: " + JSON.stringify(event));
    try {
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': "application/json"
            },
            'body': JSON.stringify({
                message: 'Hello world!'
            })
        }
    } catch (err) {
        console.error(err);
        return err;
    }

    console.log("Request: " + JSON.stringify(event));
    try {
        console.log("Adding a new item...");
        await docClient.put(params).promise();
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': "application/json"
            },
            'body': JSON.stringify({
                message: 'Successfully created item!'
            })
        }
    } catch (err) {
        console.error(err);
        response = {
            'statusCode': 403,
            'headers': {
                'Content-Type': "application/json"
            },
            'body': JSON.stringify(err)
        }
    }

    return response;
};
