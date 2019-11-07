#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/core')

import spec = require('../spec.json')
import { WebSpaCiCdStack } from './WebSpaCiCdStack'

const app = new cdk.App()

new WebSpaCiCdStack(app, makeStackId(), {
  projectName: spec.projectName,
})

function makeStackId() {
  return `${spec.projectName}-web-spa-ci-cd`.toLowerCase()
}
