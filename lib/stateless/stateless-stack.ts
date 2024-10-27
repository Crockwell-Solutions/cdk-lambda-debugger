import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CustomLambda } from '../constructs/custom-lambda';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { RestApi, MethodLoggingLevel, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

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

    // Create an API Gateway to trigger the Lambda function
    const api = new RestApi(this, 'Api', {
      description: 'Lambda Debugger Trigger API',
      restApiName: 'lambda-debugger-trigger-api',
      deploy: true,
      deployOptions: {
        stageName: 'api',
        loggingLevel: MethodLoggingLevel.INFO,
      },
    });

    // Add a data resource to the API
    const data = api.root.addResource('data');

    // Add a POST method to the data resource
    data.addMethod('POST', new LambdaIntegration(debuggingFunction, { proxy: true }));
  }
}
