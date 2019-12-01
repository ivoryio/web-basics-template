import cdk = require('@aws-cdk/core')
import ssm = require('@aws-cdk/aws-ssm')
import appsync = require('@aws-cdk/aws-appsync')

import { GreeterSchema, GreeterDataSource } from './greeter'

export interface ServiceStackProps extends cdk.StackProps {
  projectName: string
}

export class ServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ServiceStackProps) {
    super(scope, id, props)

    this.projectName = props.projectName

    const api = this.createApi()
    const schema = this.createSchema(api)

    GreeterDataSource.make(this, api, schema)
  }

  private createApi() {
    const api = new appsync.CfnGraphQLApi(this, 'project-api-gateway', {
      name: `${this.projectName}-api-gateway`,
      authenticationType: 'AMAZON_COGNITO_USER_POOLS'
    })

    const userPoolIdParameter = `${this.projectName}-greeter-userpoolid-ref-parameter`
    const userPoolId = ssm.StringParameter.fromStringParameterName(
      this,
      userPoolIdParameter,
      'UserPoolId'
    ).stringValue

    api.userPoolConfig = {
      userPoolId,
      awsRegion: this.region,
      defaultAction: 'ALLOW'
    }

    new appsync.CfnApiKey(this, 'project-api-gateway-key', {
      apiId: api.attrApiId
    })

    return api
  }
  private createSchema(api: appsync.CfnGraphQLApi) {
    return new appsync.CfnGraphQLSchema(this, 'project-api-gateway-schema', {
      apiId: api.attrApiId,
      definition: `
        type Schema {
          query: Query
        }

        type Query {
          ${GreeterSchema.Queries}
        }

        type Mutation {
          ${GreeterSchema.Mutations}
        }

        ${GreeterSchema.Types}
        ${GreeterSchema.Inputs}

        type NoDataOutput {
          error: Error
          success: Boolean!
        }

        type Error {
          code: String
          message: String
        }
      `
    })
  }

  private projectName: string
}
