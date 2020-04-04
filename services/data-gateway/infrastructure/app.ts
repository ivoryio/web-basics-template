import cdk = require('@aws-cdk/core')
import { ServiceStack } from './service-stack'

const PROJECT_NAME = process.env.PROJECT_NAME || 'xxx'

const app = new cdk.App()

new ServiceStack(app, `${PROJECT_NAME}-data-gateway-service`, {
  projectName: `${PROJECT_NAME}`,
  tags: {
    service: 'data-gateway'
  }
})
