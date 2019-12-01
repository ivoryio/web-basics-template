import cdk = require('@aws-cdk/core')
import iam = require('@aws-cdk/aws-iam')
import ssm = require('@aws-cdk/aws-ssm')
import lambda = require('@aws-cdk/aws-lambda')
import cognito = require('@aws-cdk/aws-cognito')

interface IServiceStackProps extends cdk.StackProps {
  projectName: string
}

export class ServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: IServiceStackProps) {
    super(scope, id, props)

    this.projectName = props.projectName

    const userPool = this.createUserPool()
    this.autoConfirmSingUp(userPool)
    this.createUserPoolWebClient(userPool)
  }

  private createUserPool() {
    const userPoolName = `${this.projectName}-user-pool`
    const userPool = new cognito.CfnUserPool(this, userPoolName, {
      userPoolName,
      usernameAttributes: ['email'],
      autoVerifiedAttributes: ['email'],
      policies: {
        passwordPolicy: {
          minimumLength: 8,
          requireNumbers: true,
          requireSymbols: true,
          requireLowercase: true,
          requireUppercase: true
        }
      },
      schema: [
        {
          name: 'email',
          required: true,
          mutable: true,
          attributeDataType: 'String'
        },
        {
          name: 'phone_number',
          required: false,
          mutable: false,
          attributeDataType: 'String'
        },
        {
          required: false,
          name: 'given_name',
          mutable: true,
          attributeDataType: 'String'
        },
        {
          required: false,
          name: 'family_name',
          mutable: true,
          attributeDataType: 'String'
        }
      ]
    })

    const userPoolIdParameterName = `${this.projectName}-userpool-id-parameter`
    new ssm.StringParameter(this, userPoolIdParameterName, {
      stringValue: userPool.ref,
      parameterName: 'UserPoolId',
      description: `The UserPool ID for project ${this.projectName}`
    })

    return userPool
  }
  private autoConfirmSingUp(userPool: cognito.CfnUserPool) {
    const functionName = `${this.projectName}-user-pool-presignup`
    const preSignUpFunc = new lambda.Function(this, functionName, {
      runtime: lambda.Runtime.NODEJS_10_X,
      memorySize: 256,
      code: lambda.InlineCode
        .fromInline(`exports.handler = (event, context, callback) => {
          // Confirm the user
          event.response.autoConfirmUser = true;
    
          // Set the email as verified if it is in the request
          if (event.request.userAttributes.hasOwnProperty("email")) {
            event.response.autoVerifyEmail = true;
          }
    
          // Set the phone number as verified if it is in the request
          if (event.request.userAttributes.hasOwnProperty("phone_number")) {
            event.response.autoVerifyPhone = true;
          }
    
          // Return to Amazon Cognito
          callback(null, event);
        };`),
      handler: 'index.handler'
    })

    const permissionName = `${this.projectName}-presignup-lambda-permission-cognito`
    preSignUpFunc.addPermission(permissionName, {
      sourceArn: userPool.attrArn,
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('cognito-idp.amazonaws.com')
    })

    userPool.lambdaConfig = {
      preSignUp: preSignUpFunc.functionArn
    }
  }
  private createUserPoolWebClient(userPool: cognito.CfnUserPool) {
    const clientName = `${this.projectName}-userpool-web-client`
    return new cognito.CfnUserPoolClient(this, clientName, {
      clientName: clientName,
      generateSecret: false,
      refreshTokenValidity: 365,
      userPoolId: userPool.ref,
      explicitAuthFlows: ['USER_PASSWORD_AUTH']
    })
  }

  private readonly projectName: string
}
