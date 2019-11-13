import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as shortUUID from 'short-uuid'
import * as cf from '@aws-cdk/aws-cloudfront'
import * as route53 from '@aws-cdk/aws-route53'
import * as route53Targets from '@aws-cdk/aws-route53-targets'

export interface DeploymentDNSInfo {
  recordName: string
  hostedZoneId: string
  appDomainName: string
  certificateARN: string
}

export interface DeploymentProps extends cdk.StackProps {
  dnsInfo: DeploymentDNSInfo
}

export class WebSPADeploymentEnvironment extends cdk.Construct {
  public readonly deploymentBucket: s3.Bucket
  public readonly cloudFrontDistribution: cf.CloudFrontWebDistribution

  constructor(scope: cdk.Construct, id: string, props: DeploymentProps) {
    super(scope, id)

    this.deploymentBucket = this.createDeploymentBucket()
    this.cloudFrontDistribution = this.createCDNDistribution(this.deploymentBucket, props.dnsInfo)

    this.createDnsAlias(props.dnsInfo, this.cloudFrontDistribution)
  }

  private createDeploymentBucket() {
    return new s3.Bucket(this, shortUUID.generate(), {
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    })
  }
  private createCDNDistribution(deploymentBucket: s3.IBucket, dnsInfo: DeploymentDNSInfo) {
    const props: cf.CloudFrontWebDistributionProps = {
      aliasConfiguration: dnsInfo.certificateARN
        ? {
            acmCertRef: dnsInfo.certificateARN,
            names: [`${dnsInfo.recordName}.${dnsInfo.appDomainName}`],
          }
        : undefined,
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: deploymentBucket,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
    }

    return new cf.CloudFrontWebDistribution(this, shortUUID.generate(), props)
  }
  private createDnsAlias(dnsInfo: DeploymentDNSInfo, distibution: cf.CloudFrontWebDistribution) {
    const props = {
      zoneName: dnsInfo.appDomainName,
      hostedZoneId: dnsInfo.hostedZoneId,
    }
    const zone = route53.HostedZone.fromHostedZoneAttributes(this, shortUUID.generate(), props)
    const target = route53.AddressRecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distibution)
    )

    new route53.ARecord(this, shortUUID.generate(), {
      zone,
      target,
      recordName: dnsInfo.recordName,
    })
  }
}
