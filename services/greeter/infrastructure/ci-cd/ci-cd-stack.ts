// import cdk = require('@aws-cdk/core')
// import s3 = require('@aws-cdk/aws-s3')
// import codebuild = require('@aws-cdk/aws-codebuild')
// import codecommit = require('@aws-cdk/aws-codecommit')

// export interface IServiceCICDProps extends cdk.StackProps {
//   serviceName: string
// }

// export class ServiceCICDStack extends cdk.Stack {
//   constructor(scope: cdk.App, id: string, props: IServiceCICDProps) {
//     super(scope, id, props)

//     const repository = this.createGitRepository(props)
//     const buildProject = this.createBuildProject(props, repository)
//   }

//   private createGitRepository(props: IServiceCICDProps) {
//     return new codecommit.Repository(this, `${props.serviceName}-repository`, {
//       repositoryName: props.serviceName,
//       description: `Git CodeCommit repository for ${props.serviceName}`
//     })
//   }

//   private createBuildProject(
//     props: IServiceCICDProps,
//     repository: codecommit.IRepository
//   ) {
//     const { serviceName } = props
//     const projectName = `${serviceName}-build`

//     const buildArtifactsBucket = new s3.Bucket(
//       this,
//       `${serviceName}-build-artifacts`
//     )

//     new codebuild.Project(this, projectName, {
//       projectName,
//       environment: {
//           computeType: codebuild.ComputeType.SMALL,
//           buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1
//       },
//       source: codebuild.Source.codeCommit({repository}),
//       buildSpec: codebuild.BuildSpec.fromObject(value),
//       description: `CodeBuild project for ${props.serviceName} created by Ivory.`
//     })
//   }
// }
