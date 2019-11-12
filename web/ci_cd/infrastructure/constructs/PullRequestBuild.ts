import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as shortUUID from 'short-uuid'
import * as lambda from '@aws-cdk/aws-lambda'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as targets from '@aws-cdk/aws-events-targets'
import * as codecommit from '@aws-cdk/aws-codecommit'

type KeyValue = { [key: string]: any }

export interface PullRequestBuildProps {
  buildSpec: KeyValue
  repository: codecommit.IRepository
}

export class PullRequestBuild extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: PullRequestBuildProps) {
    super(scope, id)

    const { repository, buildSpec } = props

    const buildProject = this.createBuildProject(repository, buildSpec)
    this.createdLambdaHandler(buildProject, repository)
  }

  private createBuildProject(repository: codecommit.IRepository, buildSpec: KeyValue) {
    const buildProjectName = `${shortUUID.generate()}`

    const props: codebuild.ProjectProps = {
      projectName: buildProjectName,
      buildSpec: codebuild.BuildSpec.fromObject(buildSpec),
      source: codebuild.Source.codeCommit({ repository }),
    }

    return new codebuild.Project(this, buildProjectName, props)
  }

  private createdLambdaHandler(
    buildProject: codebuild.IProject,
    repository: codecommit.IRepository
  ) {
    const functionName = `${shortUUID.generate()}-PullRequestBot`

    const func = createFunction.call(this)
    grantPermissions(func)
    listenToRepositoryEvents(func)
    listenToBuildEvents(func)

    function createFunction(this: PullRequestBuild) {
      return new lambda.Function(this, `${shortUUID.generate()}`, {
        functionName,
        memorySize: 256,
        description:
          'Triggers builds when a PR is open or changes state and posts comments with the builds status (in progress, succeeded or failed).',
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'index.handler',
        environment: {
          REPOSITORY_NAME: repository.repositoryName,
          BUILD_PROJECT_NAME: buildProject.projectName,
        },
        code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/pullRequestBuild')),
      })
    }
    function grantPermissions(func: lambda.IFunction) {
      func.addToRolePolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [repository.repositoryArn],
          actions: ['codecommit:PostCommentForPullRequest'],
        })
      )
      func.addToRolePolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [buildProject.projectArn],
          actions: ['codebuild:StartBuild'],
        })
      )
    }
    function listenToRepositoryEvents(func: lambda.IFunction) {
      repository.onPullRequestStateChange(`${shortUUID.generate()}`, {
        target: new targets.LambdaFunction(func),
      })
    }
    function listenToBuildEvents(func: lambda.IFunction) {
      buildProject.onBuildFailed(`${shortUUID.generate()}`, {
        target: new targets.LambdaFunction(func),
      })
      buildProject.onBuildStarted(`${shortUUID.generate()}`, {
        target: new targets.LambdaFunction(func),
      })
      buildProject.onBuildSucceeded(`${shortUUID.generate()}`, {
        target: new targets.LambdaFunction(func),
      })
    }
  }
}
