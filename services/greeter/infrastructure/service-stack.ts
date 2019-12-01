import path = require('path')
import cdk = require('@aws-cdk/core')
import sns = require('@aws-cdk/aws-sns')
import ssm = require('@aws-cdk/aws-ssm')
import lambda = require('@aws-cdk/aws-lambda')
import dynamodb = require('@aws-cdk/aws-dynamodb')

export interface ServiceStackProps extends cdk.StackProps {
  projectName: string
}

export class ServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ServiceStackProps) {
    super(scope, id, props)

    this.projectName = props.projectName

    const mainTable = this.createMainTable()
    const graphQLResolver = this.createGraphQLResolver(mainTable)

    mainTable.grantReadWriteData(graphQLResolver)
  }

  private createMainTable() {
    const tableName = `${this.projectName}-greeter-salutation-table`
    return new dynamodb.Table(this, tableName, {
      tableName,
      partitionKey: { name: 'salutation', type: dynamodb.AttributeType.STRING }
    })
  }
  private createGraphQLResolver(mainTable: dynamodb.Table) {
    const functionName = `${this.projectName}-greeter-graphql-resolver`
    const resolver = new lambda.Function(this, functionName, {
      functionName,
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'delivery/graphql/resolver.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
      environment: {
        SALUTATION_TABLE: mainTable.tableName
      }
    })

    new ssm.StringParameter(this, 'greeter-graphql-resolver-paramter', {
      stringValue: resolver.functionArn,
      parameterName: 'GreeterGraphQLResolver',
      description:
        'The Lambda ARN that resolves GraphQL requests for the Greeter service'
    })

    return resolver
  }

  private projectName: string
}
