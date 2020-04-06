import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'

import cdk = require('@aws-cdk/core')
import ssm = require('@aws-cdk/aws-ssm')
import appsync = require('@aws-cdk/aws-appsync')

import { GreeterDataSource } from './greeter'

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
    const api = new appsync.CfnGraphQLApi(this, `${this.projectName}-data-gateway`, {
      name: `${this.projectName}-data-gateway`,
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    })

    const userPoolIdParameter = `${this.projectName}-greeter-userpoolid-ref-parameter`
    const userPoolId = ssm.StringParameter.fromStringParameterName(this, userPoolIdParameter, 'UserPoolId').stringValue

    api.userPoolConfig = {
      userPoolId,
      awsRegion: this.region,
      defaultAction: 'ALLOW',
    }

    new appsync.CfnApiKey(this, `${this.projectName}-data-gateway-key`, {
      apiId: api.attrApiId,
    })

    return api
  }
  private createSchema(api: appsync.CfnGraphQLApi) {
    const schema = this.readSchema()
    return new appsync.CfnGraphQLSchema(this, `${this.projectName}-data-gateway-schema`, {
      apiId: api.attrApiId,
      definition: schema,
    })
  }

  private readSchema() {
    const mainSchema = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8')

    const contents = readdirSync(__dirname)

    const schemas = contents.map((f) => {
      try {
        const m = readdirSync(join(__dirname, f))
        if (m.includes('schema.graphql')) {
          return readFileSync(join(__dirname, f, 'schema.graphql'), 'utf-8')
        }
        return ''
      } catch (err) {
        return ''
      }
    })

    return `${mainSchema}${schemas.join('\n')}`
  }

  private projectName: string
}
