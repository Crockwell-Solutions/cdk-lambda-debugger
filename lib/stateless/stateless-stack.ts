import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CustomLambda } from '../constructs/custom-lambda';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export class StatelessStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a queue that will be used to receive messages from the Lambda function
    const debuggingQueue = new Queue(this, 'LambdaDebuggerQueue', {
      queueName: 'LambdaDebuggerQueue',
    });

    // Create a Lambda function that will send messages to the queue and demonstrate debugging
    const debuggingFunction = new CustomLambda(this, 'LambdaDebuggingFunction', {
      path: 'src/lambda-debugging-function.ts',
      environmentVariables: {
        SQS_QUEUE_URL: debuggingQueue.queueUrl,
      },
    }).lambda;

    // Grant the Lambda function permissions to send messages to the queue
    debuggingQueue.grantSendMessages(debuggingFunction);
  }
}
