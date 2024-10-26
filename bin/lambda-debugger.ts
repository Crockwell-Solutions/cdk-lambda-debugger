#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StatelessStack } from '../lib/stateless/stateless-stack';

const app = new cdk.App();
new StatelessStack(app, 'LambdaDebuggerStack', {});
