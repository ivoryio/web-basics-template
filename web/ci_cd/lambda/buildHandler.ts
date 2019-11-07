import util from 'util'
import CodeBuild from 'aws-sdk/clients/codebuild'
import CodeCommit from 'aws-sdk/clients/codecommit'

const codebuild = new CodeBuild()
const codecommit = new CodeCommit()

module.exports.handler = async (event: any) => {
  try {
    log({ message: 'Event received', data: event })

    if (isSourceCodeEvent(event)) {
      await handlePullRequestEvent(event)
    } else if (isBuildEvent(event)) {
      await handleBuildEvent(event)
    } else {
      log({ message: 'Not a pull-request-related CodeCommit or CodeBuild event' })
    }
  } catch (err) {
    log(err)
  }
}

function isSourceCodeEvent(event: any) {
  return (
    event.source &&
    event.source === 'aws.codecommit' &&
    event['detail-type'] === 'CodeCommit Pull Request State Change'
  )
}
function isBuildEvent(event: any) {
  return (
    event.source &&
    event.source == 'aws.codebuild' &&
    event['detail-type'] === 'CodeBuild Build State Change'
  )
}

async function handlePullRequestEvent(event: any) {
  if (isPullRequestEvent()) {
    const params = makeStartBuildParams()

    log({ message: 'Start build', data: params })
    await codebuild.startBuild(params).promise()
  } else {
    log({ message: 'Not a buildable pull request update' })
  }

  function isPullRequestEvent() {
    const eventType = event.detail.event
    return eventType === 'pullRequestCreated' || eventType === 'pullRequestSourceBranchUpdated'
  }
  function makeStartBuildParams() {
    const params = {
      sourceVersion: event.detail.sourceCommit as string,
      projectName: process.env.BUILD_PROJECT_NAME!,
      // We will use the pull request env variables later to post a comment about the build to the PR
      environmentVariablesOverride: [
        {
          name: 'CODECOMMIT_PULL_REQUEST_ID',
          value: event.detail.pullRequestId,
          type: 'PLAINTEXT',
        },
        {
          name: 'CODECOMMIT_PULL_REQUEST_SRC_COMMIT',
          value: event.detail.sourceCommit,
          type: 'PLAINTEXT',
        },
        {
          name: 'CODECOMMIT_PULL_REQUEST_DST_COMMIT',
          value: event.detail.destinationCommit,
          type: 'PLAINTEXT',
        },
      ],
    }

    return params
  }
}
async function handleBuildEvent(event: any) {
  const pullRequestIdEnvVar = extractEnvVariable('CODECOMMIT_PULL_REQUEST_ID')
  const sourceCommitEnvVar = extractEnvVariable('CODECOMMIT_PULL_REQUEST_SRC_COMMIT')
  const destinationCommitEnvVar = extractEnvVariable('CODECOMMIT_PULL_REQUEST_DST_COMMIT')

  if (isTriggeredFromPullRequest()) {
    const comment = makeComment()
    const requestToken = makeRequestToken()
    const params = {
      content: comment,
      clientRequestToken: requestToken,
      afterCommitId: sourceCommitEnvVar.value,
      pullRequestId: pullRequestIdEnvVar.value,
      repositoryName: process.env.REPOSITORY_NAME!,
      beforeCommitId: destinationCommitEnvVar.value,
    }

    log({ message: 'Post comment for PR', data: params })
    await codecommit.postCommentForPullRequest(params).promise()
  } else {
    log({ message: 'Not a pull-request build' })
  }

  function extractEnvVariable(variable: string) {
    const vars = event.detail['additional-information'].environment['environment-variables']

    return vars.find((buildEnvVar: any) => buildEnvVar.name == variable)
  }
  function isTriggeredFromPullRequest() {
    return pullRequestIdEnvVar && sourceCommitEnvVar && destinationCommitEnvVar
  }
  function makeComment() {
    const buildArn = event.detail['build-id']
    const buildId = buildArn.split('/').pop()
    const buildUuid = buildId.split(':').pop()
    const buildStatus = event.detail['build-status']
    const region = event.region
    // Only comment once per build and build status

    // Construct a comment based on build status
    var comment = `Build ${buildUuid}  `

    switch (buildStatus) {
      case 'IN_PROGRESS':
        comment += 'is **in progress**.'
        break
      case 'SUCCEEDED':
        comment += '**succeeded!**'
        break
      case 'STOPPED':
        comment += 'was **canceled**.'
        break
      case 'TIMED_OUT':
        comment += '**timed out**.'
        break
      default:
        comment += '**failed**.'
    }

    comment +=
      ` Visit the [AWS CodeBuild console](https:\/\/${region}.console.aws.amazon.com\/codebuild\/home?` +
      `region=${region}#\/builds\/${encodeURI(buildId)}\/view\/new) to view the build details.`

    return comment
  }
  function makeRequestToken() {
    const buildArn = event.detail['build-id']
    const buildStatus = event.detail['build-status']

    return buildArn + buildStatus
  }
}

function log(obj: any) {
  console.log(
    util.inspect(obj, {
      compact: false,
      depth: 5,
      breakLength: 100,
    })
  )
}
