/**
 * Lambda Debugger Function
 * 
 * A simple test function that performs the following actions
 * - Logs the event object passed to the function
 * - Sends the event payload to an SQS queue
 * - Waits for a random amount of time between 1 and 10 seconds
 * - Logs the message ID of the message sent to the SQS queue
 * 
 * This function is used to demonstrate how to debug a Lambda function using the AWS CDK
 * and the Serverless Framework.
 */

import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

// Use the AWS Lambda Powertools Logger
import { Logger } from '@aws-lambda-powertools/logger';
export const logger = new Logger();

// Setup the sqs client to send messages to the queue
const sqsClient = new SQSClient({ region: 'eu-west-1' });

/**
 * Lambda Handler
 *
 * @param {object} event - The event object containing the payload passed to this function.
 * @param {object} context - The context object provided by the AWS Lambda runtime.
 */
export async function handler(event: any) {
  logger.info('Processing lambda debugger function 2', { event: event });

  logger.info('Sending message to SQS queue', { queueUrl: SQS_QUEUE_URL });

  const params = new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(event),
  });

  try {
    const response = await sqsClient.send(params);
    logger.info('Response from queue', { response: response });
  } catch (err) {
    logger.error('Error invoking queue', { error: err });
  }

  logger.info('Lambda debugger function completed');

};
