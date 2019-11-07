import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from '@aws-cdk/aws-lambda'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as codecommit from '@aws-cdk/aws-codecommit'
import * as targets from '@aws-cdk/aws-events-targets'

export interface IWebSpaCiCdStackProps extends cdk.StackProps {
  projectName: string
}

export class WebSpaCiCdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: IWebSpaCiCdStackProps) {
    super(scope, id, props)

    const { projectName } = props

    const repository = this.createCodeRepository(projectName)
    const buildProj = this.createBuildProject(projectName, repository)
    const buildNotifier = this.createPRBuildHandler(projectName, repository, buildProj)

    buildNotifier.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [repository.repositoryArn],
        actions: ['codecommit:PostCommentForPullRequest'],
      })
    )
    buildNotifier.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [buildProj.projectArn],
        actions: ['codebuild:StartBuild'],
      })
    )

    repository.onPullRequestStateChange('web-spa-pr', {
      target: new targets.LambdaFunction(buildNotifier),
    })

    buildProj.onBuildFailed('web-spa-build-failed', {
      target: new targets.LambdaFunction(buildNotifier),
    })
    buildProj.onBuildStarted('web-spa-build-started', {
      target: new targets.LambdaFunction(buildNotifier),
    })
    buildProj.onBuildSucceeded('web-spa-build-succeeded', {
      target: new targets.LambdaFunction(buildNotifier),
    })
  }

  private createPRBuildHandler(
    projectName: string,
    repository: codecommit.IRepository,
    buildProject: codebuild.IProject
  ) {
    const functionName = `IvoryBuildBot`

    return new lambda.Function(this, `${projectName}-web-spa-pr-buildhandler`, {
      functionName,
      memorySize: 256,
      description: 'Post comments on a PR when a build started, succeseded or failed for a PR',
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'buildHandler.handler',
      environment: {
        REPOSITORY_NAME: repository.repositoryName,
        BUILD_PROJECT_NAME: buildProject.projectName,
      },
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
    })
  }

  private createCodeRepository(projectName: string) {
    const repositoryName = `${projectName}-web-spa-repo`.toLowerCase()

    const props = {
      repositoryName,
      description: `The Web SPA source code for ${projectName} created by Ivory.`,
    }

    return new codecommit.Repository(this, repositoryName, props)
  }
  private createBuildProject(projectName: string, repository: codecommit.Repository) {
    const buildProjectName = `${projectName}-web-spa-pullrequest-build`

    const props: codebuild.ProjectProps = {
      buildSpec: makeBuildSpec(),
      projectName: buildProjectName,
      source: codebuild.Source.codeCommit({ repository }),
    }

    return new codebuild.Project(this, buildProjectName, props)

    function makeBuildSpec() {
      return codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: ['echo pre_build'],
          },
          build: {
            commands: ['echo build'],
          },
        },
      })
    }
  }
}
