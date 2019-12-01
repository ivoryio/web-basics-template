import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync"

import Auth from "@aws-amplify/auth"
import Amplify from "aws-amplify"
import awsconfig from "config/aws-exports"

Amplify.configure(awsconfig)

export const appsyncClient = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  disableOffline: true
})
