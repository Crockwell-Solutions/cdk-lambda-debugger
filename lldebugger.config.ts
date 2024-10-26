import { type LldConfigTs } from "lambda-live-debugger";

export default {
  // Framework to use
  framework: "cdk",
  // AWS CDK framework context
  context: ['environment=development'],
  // Serverless Framework stage
  // stage:
  // Monorepo subfolder
  // subfolder:
  // Filter by function name. You can use * as a wildcard
  // function:
  // AWS profile
  // profile:
  // AWS region
  region: "eu-west-1",
  // AWS role
  // role:
  // SAM framework environment
  // configEnv:
  // SAM framework configuration file
  // samConfigFile:
  // SAM framework template file
  // samTemplateFile:
  // Observable mode
  observable: false,
  // Observable mode interval
  // interval:
  // Verbose logging
  verbose: false,
  // Modify Lambda function list or support custom framework
  // getLambdas: async (foundLambdas) => {
  //   you can customize the list of Lambdas here or create your own
  //   return foundLambdas;
  // },
} satisfies LldConfigTs;