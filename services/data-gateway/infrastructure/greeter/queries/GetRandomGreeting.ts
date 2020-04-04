import cdk = require('@aws-cdk/core')
import appsync = require('@aws-cdk/aws-appsync')

export default class GetRandomGreeting {

  public static createResolver(
    parent: cdk.Construct,
    api: appsync.CfnGraphQLApi,
    schema: appsync.CfnGraphQLSchema,
    dataSource: appsync.CfnDataSource
  ) {
    const resolver = new appsync.CfnResolver(
      parent,
      'greeter-get-one-resolver',
      {
        apiId: api.attrApiId,
        typeName: 'Query',
        fieldName: 'getRandomGreeting',
        dataSourceName: dataSource.name,
        requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "target": "greeting",
          "operation": "getRandomGreeting",
          "identity": $util.toJson($context.identity),
          "args": $util.toJson($context.arguments)
        }
      }`,
        responseMappingTemplate: `$util.toJson($context.result)`
      }
    )
    resolver.addDependsOn(schema)
    resolver.addDependsOn(dataSource)
  }
}
