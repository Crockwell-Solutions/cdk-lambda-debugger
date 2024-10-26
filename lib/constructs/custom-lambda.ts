import * as path from 'path';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Runtime, Tracing, Architecture } from 'aws-cdk-lib/aws-lambda';

const lambdaPowerToolsConfig = {
  POWERTOOLS_LOGGER_LOG_EVENT: 'true',
  POWERTOOLS_LOGGER_SAMPLE_RATE: '0.05',
  POWERTOOLS_TRACE_ENABLED: 'enabled',
  POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'captureHTTPsRequests',
  POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'captureResult',
  POWERTOOLS_METRICS_NAMESPACE: 'LambdaDebugger',
};

const lambdaDefaultEnvironmentVariables = {
  NODE_OPTIONS: '--enable-source-maps',
};

interface CustomLambdaProps extends NodejsFunctionProps {
  readonly path: string; // The path to the lambda function
  readonly environmentVariables?: object; // Additional environment variables to add to the function
  readonly externalModules?: [string] | []; // Array of external modules to include explicitly
  readonly logLevel?: string; // The log level for the Lambda function
  readonly minifyCodeOnDeployment?: boolean; // Whether to minify the code on deployment
}

const defaultLambdaProps = {
  memorySize: 512,
  timeout: Duration.seconds(60),
  handler: 'handler',
  environmentVariables: {},
};

export class CustomLambda extends Construct {
  public readonly lambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: CustomLambdaProps) {
    super(scope, id);

    // Merge the default lambda props with the provided ones
    props = { ...defaultLambdaProps, ...props };

    this.lambda = new NodejsFunction(this, id, {
      functionName: props.functionName ? props.functionName : id, // If no function name is provided, use the lambda construct id
      memorySize: props.memorySize,
      timeout: props.timeout,
      entry: path.join(__dirname, '/../../', props.path),
      environment: {
        ...lambdaDefaultEnvironmentVariables,
        ...lambdaPowerToolsConfig,
        POWERTOOLS_SERVICE_NAME: props.functionName ? props.functionName : id,
        LOG_LEVEL: props.logLevel || 'INFO',
        ...props.environmentVariables,
      },
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      handler: props.handler,
      logRetention: RetentionDays.THREE_MONTHS,
      tracing: Tracing.ACTIVE,
      // Set the ESBuild options for the lambda function
      bundling: {
        sourceMap: true,
        minify: props.minifyCodeOnDeployment || true,
        esbuildArgs: {
          '--log-level': 'warning',
        },
        ...(props.externalModules && { externalModules: props.externalModules }),
      },
      ...(props.vpc && {
        vpc: props.vpc,
        vpcSubnets: props.vpcSubnets,
        securityGroups: props.securityGroups,
      }),
    });
  }
}
