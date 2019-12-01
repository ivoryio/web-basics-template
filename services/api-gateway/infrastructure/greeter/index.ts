import cdk = require('@aws-cdk/core')
import ssm = require('@aws-cdk/aws-ssm')
import iam = require('@aws-cdk/aws-iam')
import appsync = require('@aws-cdk/aws-appsync')

import SaveSalutation from './mutations/CreateGreeting'
import GetRandomGreeting from './queries/GetRandomGreeting'

export class GreeterSchema {
  public static readonly Types = `
    type Greeting {
      message: String!
    }

    type GreetingOutput {
      data: Greeting
      error: Error
      success: Boolean!
    }
  `
  public static Inputs = `
    ${SaveSalutation.input}
  `
  public static readonly Queries = `
    ${GetRandomGreeting.query}
  `
  public static readonly Mutations = `
    ${SaveSalutation.mutation}
  `
}

export class GreeterDataSource {
  public static make(
    parent: cdk.Construct,
    api: appsync.CfnGraphQLApi,
    schema: appsync.CfnGraphQLSchema
  ) {
    const param = ssm.StringParameter.fromStringParameterName(
      parent,
      'greeter-resolver-parameter',
      'GreeterGraphQLResolver'
    )

    const lambdaFullAccessRole = new iam.Role(parent, 'GreeterDataSourceRole', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com')
    })

    lambdaFullAccessRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambdaFullAccess')
    )

    const dataSource = new appsync.CfnDataSource(
      parent,
      'greeter-data-source',
      {
        apiId: api.attrApiId,
        name: `GreeterDataSource`,
        type: 'AWS_LAMBDA',
        lambdaConfig: {
          lambdaFunctionArn: param.stringValue
        },
        serviceRoleArn: lambdaFullAccessRole.roleArn
      }
    )

    GreeterResolvers.makeAll(parent, api, schema, dataSource)
  }
}

class GreeterResolvers {
  public static makeAll(
    parent: cdk.Construct,
    api: appsync.CfnGraphQLApi,
    schema: appsync.CfnGraphQLSchema,
    dataSource: appsync.CfnDataSource
  ) {
    GetRandomGreeting.createResolver(parent, api, schema, dataSource)
    SaveSalutation.createResolver(parent, api, schema, dataSource)
  }
}
