/* eslint camelcase: 0 */

export default {
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_oNkmlF7sb",
    userPoolWebClientId: "prtvena1mrvvvh74nnjtp3oje"
  },
  aws_appsync_graphqlEndpoint:
    "https://toxydgyshbfqvlrnk747cvozuy.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  API: {
    graphql_headers: async () => ({})
  },
  Analytics: {
    disabled: true
  }
}
