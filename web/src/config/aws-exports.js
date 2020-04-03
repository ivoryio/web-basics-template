/* eslint camelcase: 0 */

export default {
  Auth: {
    region: 'us-east-1',
    userPoolId: '',
    userPoolWebClientId: '',
  },
  aws_appsync_graphqlEndpoint: '',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  API: {
    graphql_headers: async () => ({}),
  },
  Analytics: {
    disabled: true,
  },
}
