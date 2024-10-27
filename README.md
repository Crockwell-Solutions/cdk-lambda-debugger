# Lambda Debugger

Local Debugging of your CDK Typescript Project Lambda Functions in VSCode

## Description

Debugging and testing serverless applications is still an evolving topic. Complexities arise due to the diverse nature of tools, frameworks and languages available to developers.

This is a sample repo to setup a CDK project, configured with some example resources (API G/W -> Lambda -> SQS) that allows for debugging of the Lambda function using both AWS SAM and Lambda Live Debugger. This demonstrates how to iterate quickly through your Lambda function changes.

## Features

- Allows debugging of the `NodejsFunction` type Lambda functions with automatic transpile
- Rapid debugging and update cycle
- Local debugging using AWS SAM
- No need to configure a sam template.yaml, just for debugging purposes
- Remote debugging using Lambda Live Debugger
- Suitable for large CDK projects, does not require a 'cdk synth' to initiate the Debug
- Works with AWS SSO and profiles
- Suitable for ephemeral developer environment deployment
- Suitable for team developer environments, it doesn't commit local environment variables to Git
- Does not attempt to emulate resources (other than Lambda runtime), will use the remote resources configured

## Installation

Ensure you have the basic setup you will need. Follow the [CDK Installation Guide](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) to install CDK and bootstrap your target account

Also ensure you have docker installed and running. This is required by AWS SAM for local Lambda runtime environment.

Install the dependencies
```
npm install
```

Deploy the project
```
npx cdk deploy
```

## Configuration

Setup your environment variables. Copy the `local.env.json.example` file and save as `local.env.json`. This will be a set of environment variables for your local debugging and specific to your deployment. Therefore it should not be committed to code.

Ensure you have the AWS Toolkit VSCode extension installed if you are using AWS Profiles (e.g. SSO) as you can use the profile login from the Command Pallet to ensure you are connected to the correct environment for your debugging.

## Usage

There are two ways to use the Debugger.

1. Run function locally, debug locally

    This uses AWS SAM to invoke the Lambda function locally. Select `Lambda Function - SAM Debugger` from the Run and Debug menu in VSCode and hit F5. You should see the logging output. 

    This works by the launch configuration calling the preLaunchTask to build the project. The build phase will use ESBuild (akin to the `NodejsFunction` to transpile the source code. Transpiled code is stored and run from the `dist` folder which is only used for local invoke)

    You can add breakpoints to the source code in `src/lambda-debugging-function.ts` and the debugger will adhere to the source maps and link back to the original source code.

2. Run function remotely, debug locally

    This has the additional benefit of testing the permissions you have configured in CDK. This uses the [Lambda Live Debugger](https://www.lldebugger.com) project led by the industry hero Marko at [Serverless Life](https://www.serverlesslife.com).

    To run using Lambda Live Debugger, you initiate the debugging environment, Select `Lambda Function - Lambda Live Debugger` from the Run and Debug menu in VSCode and hit F5. Lambda Live Debugger will work its magic and deploy out the required resources to your account. Now, to initiate the debug environment, you need to invoke the remote Lambda function. For example, you can add your breakpoint to your local code in `src/lambda-debugging-function.ts` and then invoke the Lambda function through the API with a call such as: 
    
    ```
    curl --request POST --header "Content-Type: application/json" --data '{"message": "This is a test message"}' https://xxxxxxxx.execute-api.eu-west-1.amazonaws.com/api/data
    ```

    In case of code changes, Lambda Live Debugger automatically reloads the updated code without the need to redeploy or restart the debugger. Magic!

    Note that when you have finished debugging with Lambda Live Debugger, you can remove the debugger with `npx lld -r`

## Cleaning Up

Remove the project when you are finished:
```
npx cdk destroy
```

## License

MIT License

Copyright (c) [2024] [Ian Brumby]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

