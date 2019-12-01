import cdk = require('@aws-cdk/core')
import appsync = require('@aws-cdk/aws-appsync')

export default class SaveSalutation {
  public static readonly input = `
    input SaveSalutationInput {
      salutation: String!
    }
  `

  public static readonly mutation = `
    saveSalutation(input: SaveSalutationInput!): NoDataOutput
  `

  public static createResolver(
    parent: cdk.Construct,
    api: appsync.CfnGraphQLApi,
    schema: appsync.CfnGraphQLSchema,
    dataSource: appsync.CfnDataSource
  ) {
    const resolver = new appsync.CfnResolver(
      parent,
      'greeter-create-resolver',
      {
        apiId: api.attrApiId,
        typeName: 'Mutation',
        fieldName: 'saveSalutation',
        dataSourceName: dataSource.name,
        requestMappingTemplate: `{
              "version": "2017-02-28",
              "operation": "Invoke",
              "payload": {
                "target": "salutation",
                "operation": "saveSalutation",
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
