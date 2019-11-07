#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/core')

import spec = require('../spec.json')
import { WebSpaCiCdStack } from '../lib/WebSpaCiCdStack'

const app = new cdk.App()

new WebSpaCiCdStack(app, makeStackId('development'), {
  stage: 'development',
  projectName: spec.projectName,
})

function makeStackId(stage: string) {
  return `${spec.projectName.toLocaleLowerCase()}-web-spa-ci-cd-${stage}`
}
