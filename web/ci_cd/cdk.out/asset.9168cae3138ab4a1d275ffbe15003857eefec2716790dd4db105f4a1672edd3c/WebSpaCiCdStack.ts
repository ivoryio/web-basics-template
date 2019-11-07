import * as path from 'path'
import cdk = require('@aws-cdk/core')
import s3 = require('@aws-cdk/aws-s3')
import lambda = require('@aws-cdk/aws-lambda')
import codecommit = require('@aws-cdk/aws-codecommit')
import targets = require('@aws-cdk/aws-events-targets')

export interface IWebSpaCiCdStackProps extends cdk.StackProps {
  stage: 'development' | 'staging' | 'production'
  projectName: string
}

export class WebSpaCiCdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: IWebSpaCiCdStackProps) {
    super(scope, id, props)

    const { projectName } = props

    const repositoryName = `${projectName.toLowerCase()}-web-spa-repo`
    const repo = new codecommit.Repository(this, repositoryName, {
      repositoryName,
      description: `The Web SPA source code for ${projectName} created by Ivory`,
    })

    console.log(__dirname)
    console.log(lambda.Code.fromAsset(path.join(__dirname)).path)

    const prLambda = new lambda.Function(this, 'web-spa-pr', {
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(__dirname),
      handler: 'lambda/buildStartedNotifier.handler',
    })

    repo.onPullRequestStateChange('web-spa-pr', {
      target: new targets.LambdaFunction(prLambda),
    })
  }
}
