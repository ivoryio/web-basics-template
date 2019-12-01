import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as shortUUID from 'short-uuid'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as codecommit from '@aws-cdk/aws-codecommit'
import * as cpa from '@aws-cdk/aws-codepipeline-actions'
import * as codepipeline from '@aws-cdk/aws-codepipeline'

export namespace WebSPA {
  type KeyValue = { [key: string]: any }

  export interface DeploymentPipelineProps {
    buildSpec: KeyValue
    repository: codecommit.IRepository
  }

  export class DeploymentPipeline extends cdk.Construct {
    public readonly artifactsBucket: s3.IBucket
    public readonly buildProject: codebuild.IProject

    constructor(scope: cdk.Construct, id: string, props: DeploymentPipelineProps) {
      super(scope, id)

      this.artifactsBucket = this.createArtifactsBucket()

      this.buildProject = this.createBuildProject(props.repository, props.buildSpec)
      this.createPipeline(props.repository, this.buildProject)
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

    private createPipeline(repository: codecommit.IRepository, buildProject: codebuild.IProject) {
      const pipeline = new codepipeline.Pipeline(this, shortUUID.generate())

      const sourceCodeArtifact = addSourceStageToPipeline()
      addDeployToStagingStageToPipeline(sourceCodeArtifact, this.artifactsBucket)

      function addSourceStageToPipeline() {
        const sourceCodeOutput = new codepipeline.Artifact()
        const sourceCodeAction = new cpa.CodeCommitSourceAction({
          repository,
          output: sourceCodeOutput,
          actionName: 'GetLastestChanges',
        })

        pipeline.addStage({
          stageName: 'Source',
          actions: [sourceCodeAction],
        })
        return sourceCodeOutput
      }
      function addDeployToStagingStageToPipeline(
        sourceCodeArtifact: codepipeline.Artifact,
        artifactsBucket: s3.IBucket
      ) {
        const buildAction = new cpa.CodeBuildAction({
          runOrder: 1,
          actionName: 'Build',
          project: buildProject,
          input: sourceCodeArtifact,
        })

        const deployStagingAction = new cpa.S3DeployAction({
          runOrder: 2,
          bucket: artifactsBucket,
          actionName: 'DeployToS3Bucket',
          input: buildAction.actionProperties.outputs![0],
        })

        pipeline.addStage({
          stageName: 'DeployToStaging',
          actions: [buildAction, deployStagingAction],
        })
      }
    }

    private createArtifactsBucket() {
      return new s3.Bucket(this, shortUUID.generate())
    }
  }
}
