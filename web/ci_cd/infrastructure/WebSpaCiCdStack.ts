import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from '@aws-cdk/aws-lambda'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as codecommit from '@aws-cdk/aws-codecommit'
import * as targets from '@aws-cdk/aws-events-targets'
import { PullRequestBuild } from './constructs/PullRequestBuild'

export interface IWebSpaCiCdStackProps extends cdk.StackProps {
  projectName: string
}

export class WebSpaCiCdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: IWebSpaCiCdStackProps) {
    super(scope, id, props)

    const { projectName } = props

    const repository = this.createCodeRepository(projectName)

    new PullRequestBuild(this, `web-spa-pull-request-build`, {
      repository,
      buildSpec: this.makeBuildSpec(),
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

  private makeBuildSpec() {
    return {
      version: '0.2',
      phases: {
        pre_build: {
          commands: ['echo pre_build'],
        },
        build: {
          commands: ['echo build'],
        },
      },
    }
  }
}
