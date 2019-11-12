"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const codebuild_1 = __importDefault(require("aws-sdk/clients/codebuild"));
const codecommit_1 = __importDefault(require("aws-sdk/clients/codecommit"));
const codebuild = new codebuild_1.default();
const codecommit = new codecommit_1.default();
module.exports.handler = async (event) => {
    try {
        log({ message: 'Event received', data: event });
        if (isSourceCodeEvent(event)) {
            await handlePullRequestEvent(event);
        }
        else if (isBuildEvent(event)) {
            await handleBuildEvent(event);
        }
        else {
            log({ message: 'Not a pull-request-related CodeCommit or CodeBuild event' });
        }
    }
    catch (err) {
        log(err);
    }
};
function isSourceCodeEvent(event) {
    return (event.source &&
        event.source === 'aws.codecommit' &&
        event['detail-type'] === 'CodeCommit Pull Request State Change');
}
function isBuildEvent(event) {
    return (event.source &&
        event.source == 'aws.codebuild' &&
        event['detail-type'] === 'CodeBuild Build State Change');
}
async function handlePullRequestEvent(event) {
    if (isPullRequestEvent()) {
        const params = makeStartBuildParams();
        log({ message: 'Start build', data: params });
        await codebuild.startBuild(params).promise();
    }
    else {
        log({ message: 'Not a buildable pull request update' });
    }
    function isPullRequestEvent() {
        const eventType = event.detail.event;
        return eventType === 'pullRequestCreated' || eventType === 'pullRequestSourceBranchUpdated';
    }
    function makeStartBuildParams() {
        const params = {
            sourceVersion: event.detail.sourceCommit,
            projectName: process.env.BUILD_PROJECT_NAME,
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
        };
        return params;
    }
}
async function handleBuildEvent(event) {
    const pullRequestIdEnvVar = extractEnvVariable('CODECOMMIT_PULL_REQUEST_ID');
    const sourceCommitEnvVar = extractEnvVariable('CODECOMMIT_PULL_REQUEST_SRC_COMMIT');
    const destinationCommitEnvVar = extractEnvVariable('CODECOMMIT_PULL_REQUEST_DST_COMMIT');
    if (isTriggeredFromPullRequest()) {
        const comment = makeComment();
        const requestToken = makeRequestToken();
        const params = {
            content: comment,
            clientRequestToken: requestToken,
            afterCommitId: sourceCommitEnvVar.value,
            pullRequestId: pullRequestIdEnvVar.value,
            repositoryName: process.env.REPOSITORY_NAME,
            beforeCommitId: destinationCommitEnvVar.value,
        };
        log({ message: 'Post comment for PR', data: params });
        await codecommit.postCommentForPullRequest(params).promise();
    }
    else {
        log({ message: 'Not a pull-request build' });
    }
    function extractEnvVariable(variable) {
        const vars = event.detail['additional-information'].environment['environment-variables'];
        return vars.find((buildEnvVar) => buildEnvVar.name == variable);
    }
    function isTriggeredFromPullRequest() {
        return pullRequestIdEnvVar && sourceCommitEnvVar && destinationCommitEnvVar;
    }
    function makeComment() {
        return `Build ${makeBuildStatusMessage()} ${makeBuildDetailsLinkMessage()}`;
        function makeBuildStatusMessage() {
            let message = '';
            const buildStatus = event.detail['build-status'];
            switch (buildStatus) {
                case 'IN_PROGRESS':
                    message += 'is **in progress**.';
                    break;
                case 'SUCCEEDED':
                    message += '**succeeded!**';
                    break;
                case 'STOPPED':
                    message += 'was **canceled**.';
                    break;
                case 'TIMED_OUT':
                    message += '**timed out**.';
                    break;
                default:
                    message += '**failed**.';
            }
            return message;
        }
        function makeBuildDetailsLinkMessage() {
            const region = event.region;
            const buildArn = event.detail['build-id'];
            const buildId = buildArn.split('/').pop();
            return (` &nbsp;

        Go to the [AWS CodeBuild console](https:\/\/${region}.console.aws.amazon.com\/codebuild\/home?` +
                `region=${region}#\/builds\/${encodeURI(buildId)}\/view\/new) to view the build details.`);
        }
    }
    function makeRequestToken() {
        const buildArn = event.detail['build-id'];
        const buildStatus = event.detail['build-status'];
        return buildArn + buildStatus;
    }
}
function log(obj) {
    console.log(util_1.default.inspect(obj, {
        compact: false,
        depth: 5,
        breakLength: 100,
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGFtYmRhL2J1aWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF1QjtBQUN2QiwwRUFBaUQ7QUFDakQsNEVBQW1EO0FBRW5ELE1BQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFBO0FBQ2pDLE1BQU0sVUFBVSxHQUFHLElBQUksb0JBQVUsRUFBRSxDQUFBO0FBRW5DLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFVLEVBQUUsRUFBRTtJQUM1QyxJQUFJO1FBQ0YsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBRS9DLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNwQzthQUFNLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE1BQU0sZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDOUI7YUFBTTtZQUNMLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSwwREFBMEQsRUFBRSxDQUFDLENBQUE7U0FDN0U7S0FDRjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ1Q7QUFDSCxDQUFDLENBQUE7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEtBQVU7SUFDbkMsT0FBTyxDQUNMLEtBQUssQ0FBQyxNQUFNO1FBQ1osS0FBSyxDQUFDLE1BQU0sS0FBSyxnQkFBZ0I7UUFDakMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLHNDQUFzQyxDQUNoRSxDQUFBO0FBQ0gsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLEtBQVU7SUFDOUIsT0FBTyxDQUNMLEtBQUssQ0FBQyxNQUFNO1FBQ1osS0FBSyxDQUFDLE1BQU0sSUFBSSxlQUFlO1FBQy9CLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyw4QkFBOEIsQ0FDeEQsQ0FBQTtBQUNILENBQUM7QUFFRCxLQUFLLFVBQVUsc0JBQXNCLENBQUMsS0FBVTtJQUM5QyxJQUFJLGtCQUFrQixFQUFFLEVBQUU7UUFDeEIsTUFBTSxNQUFNLEdBQUcsb0JBQW9CLEVBQUUsQ0FBQTtRQUVyQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQzdDLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3QztTQUFNO1FBQ0wsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLHFDQUFxQyxFQUFFLENBQUMsQ0FBQTtLQUN4RDtJQUVELFNBQVMsa0JBQWtCO1FBQ3pCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQ3BDLE9BQU8sU0FBUyxLQUFLLG9CQUFvQixJQUFJLFNBQVMsS0FBSyxnQ0FBZ0MsQ0FBQTtJQUM3RixDQUFDO0lBQ0QsU0FBUyxvQkFBb0I7UUFDM0IsTUFBTSxNQUFNLEdBQUc7WUFDYixhQUFhLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFzQjtZQUNsRCxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBbUI7WUFDNUMsK0ZBQStGO1lBQy9GLDRCQUE0QixFQUFFO2dCQUM1QjtvQkFDRSxJQUFJLEVBQUUsNEJBQTRCO29CQUNsQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhO29CQUNqQyxJQUFJLEVBQUUsV0FBVztpQkFDbEI7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLG9DQUFvQztvQkFDMUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWTtvQkFDaEMsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2dCQUNEO29CQUNFLElBQUksRUFBRSxvQ0FBb0M7b0JBQzFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQjtvQkFDckMsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0Y7U0FDRixDQUFBO1FBRUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0FBQ0gsQ0FBQztBQUNELEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxLQUFVO0lBQ3hDLE1BQU0sbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtJQUM1RSxNQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLG9DQUFvQyxDQUFDLENBQUE7SUFDbkYsTUFBTSx1QkFBdUIsR0FBRyxrQkFBa0IsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0lBRXhGLElBQUksMEJBQTBCLEVBQUUsRUFBRTtRQUNoQyxNQUFNLE9BQU8sR0FBRyxXQUFXLEVBQUUsQ0FBQTtRQUM3QixNQUFNLFlBQVksR0FBRyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHO1lBQ2IsT0FBTyxFQUFFLE9BQU87WUFDaEIsa0JBQWtCLEVBQUUsWUFBWTtZQUNoQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsS0FBSztZQUN2QyxhQUFhLEVBQUUsbUJBQW1CLENBQUMsS0FBSztZQUN4QyxjQUFjLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFnQjtZQUM1QyxjQUFjLEVBQUUsdUJBQXVCLENBQUMsS0FBSztTQUM5QyxDQUFBO1FBRUQsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ3JELE1BQU0sVUFBVSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdEO1NBQU07UUFDTCxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxDQUFBO0tBQzdDO0lBRUQsU0FBUyxrQkFBa0IsQ0FBQyxRQUFnQjtRQUMxQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUE7UUFFeEYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBZ0IsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQTtJQUN0RSxDQUFDO0lBQ0QsU0FBUywwQkFBMEI7UUFDakMsT0FBTyxtQkFBbUIsSUFBSSxrQkFBa0IsSUFBSSx1QkFBdUIsQ0FBQTtJQUM3RSxDQUFDO0lBQ0QsU0FBUyxXQUFXO1FBQ2xCLE9BQU8sU0FBUyxzQkFBc0IsRUFBRSxJQUFJLDJCQUEyQixFQUFFLEVBQUUsQ0FBQTtRQUUzRSxTQUFTLHNCQUFzQjtZQUM3QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7WUFFaEIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUNoRCxRQUFRLFdBQVcsRUFBRTtnQkFDbkIsS0FBSyxhQUFhO29CQUNoQixPQUFPLElBQUkscUJBQXFCLENBQUE7b0JBQ2hDLE1BQUs7Z0JBQ1AsS0FBSyxXQUFXO29CQUNkLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQTtvQkFDM0IsTUFBSztnQkFDUCxLQUFLLFNBQVM7b0JBQ1osT0FBTyxJQUFJLG1CQUFtQixDQUFBO29CQUM5QixNQUFLO2dCQUNQLEtBQUssV0FBVztvQkFDZCxPQUFPLElBQUksZ0JBQWdCLENBQUE7b0JBQzNCLE1BQUs7Z0JBQ1A7b0JBQ0UsT0FBTyxJQUFJLGFBQWEsQ0FBQTthQUMzQjtZQUVELE9BQU8sT0FBTyxDQUFBO1FBQ2hCLENBQUM7UUFDRCxTQUFTLDJCQUEyQjtZQUNsQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFBO1lBQzNCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDekMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtZQUV6QyxPQUFPLENBQ0w7O3NEQUU4QyxNQUFNLDJDQUEyQztnQkFDL0YsVUFBVSxNQUFNLGNBQWMsU0FBUyxDQUFDLE9BQU8sQ0FBQyx5Q0FBeUMsQ0FDMUYsQ0FBQTtRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsU0FBUyxnQkFBZ0I7UUFDdkIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUN6QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBRWhELE9BQU8sUUFBUSxHQUFHLFdBQVcsQ0FBQTtJQUMvQixDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsR0FBRyxDQUFDLEdBQVE7SUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUNoQixPQUFPLEVBQUUsS0FBSztRQUNkLEtBQUssRUFBRSxDQUFDO1FBQ1IsV0FBVyxFQUFFLEdBQUc7S0FDakIsQ0FBQyxDQUNILENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCBDb2RlQnVpbGQgZnJvbSAnYXdzLXNkay9jbGllbnRzL2NvZGVidWlsZCdcbmltcG9ydCBDb2RlQ29tbWl0IGZyb20gJ2F3cy1zZGsvY2xpZW50cy9jb2RlY29tbWl0J1xuXG5jb25zdCBjb2RlYnVpbGQgPSBuZXcgQ29kZUJ1aWxkKClcbmNvbnN0IGNvZGVjb21taXQgPSBuZXcgQ29kZUNvbW1pdCgpXG5cbm1vZHVsZS5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSkgPT4ge1xuICB0cnkge1xuICAgIGxvZyh7IG1lc3NhZ2U6ICdFdmVudCByZWNlaXZlZCcsIGRhdGE6IGV2ZW50IH0pXG5cbiAgICBpZiAoaXNTb3VyY2VDb2RlRXZlbnQoZXZlbnQpKSB7XG4gICAgICBhd2FpdCBoYW5kbGVQdWxsUmVxdWVzdEV2ZW50KGV2ZW50KVxuICAgIH0gZWxzZSBpZiAoaXNCdWlsZEV2ZW50KGV2ZW50KSkge1xuICAgICAgYXdhaXQgaGFuZGxlQnVpbGRFdmVudChldmVudClcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nKHsgbWVzc2FnZTogJ05vdCBhIHB1bGwtcmVxdWVzdC1yZWxhdGVkIENvZGVDb21taXQgb3IgQ29kZUJ1aWxkIGV2ZW50JyB9KVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nKGVycilcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1NvdXJjZUNvZGVFdmVudChldmVudDogYW55KSB7XG4gIHJldHVybiAoXG4gICAgZXZlbnQuc291cmNlICYmXG4gICAgZXZlbnQuc291cmNlID09PSAnYXdzLmNvZGVjb21taXQnICYmXG4gICAgZXZlbnRbJ2RldGFpbC10eXBlJ10gPT09ICdDb2RlQ29tbWl0IFB1bGwgUmVxdWVzdCBTdGF0ZSBDaGFuZ2UnXG4gIClcbn1cbmZ1bmN0aW9uIGlzQnVpbGRFdmVudChldmVudDogYW55KSB7XG4gIHJldHVybiAoXG4gICAgZXZlbnQuc291cmNlICYmXG4gICAgZXZlbnQuc291cmNlID09ICdhd3MuY29kZWJ1aWxkJyAmJlxuICAgIGV2ZW50WydkZXRhaWwtdHlwZSddID09PSAnQ29kZUJ1aWxkIEJ1aWxkIFN0YXRlIENoYW5nZSdcbiAgKVxufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQdWxsUmVxdWVzdEV2ZW50KGV2ZW50OiBhbnkpIHtcbiAgaWYgKGlzUHVsbFJlcXVlc3RFdmVudCgpKSB7XG4gICAgY29uc3QgcGFyYW1zID0gbWFrZVN0YXJ0QnVpbGRQYXJhbXMoKVxuXG4gICAgbG9nKHsgbWVzc2FnZTogJ1N0YXJ0IGJ1aWxkJywgZGF0YTogcGFyYW1zIH0pXG4gICAgYXdhaXQgY29kZWJ1aWxkLnN0YXJ0QnVpbGQocGFyYW1zKS5wcm9taXNlKClcbiAgfSBlbHNlIHtcbiAgICBsb2coeyBtZXNzYWdlOiAnTm90IGEgYnVpbGRhYmxlIHB1bGwgcmVxdWVzdCB1cGRhdGUnIH0pXG4gIH1cblxuICBmdW5jdGlvbiBpc1B1bGxSZXF1ZXN0RXZlbnQoKSB7XG4gICAgY29uc3QgZXZlbnRUeXBlID0gZXZlbnQuZGV0YWlsLmV2ZW50XG4gICAgcmV0dXJuIGV2ZW50VHlwZSA9PT0gJ3B1bGxSZXF1ZXN0Q3JlYXRlZCcgfHwgZXZlbnRUeXBlID09PSAncHVsbFJlcXVlc3RTb3VyY2VCcmFuY2hVcGRhdGVkJ1xuICB9XG4gIGZ1bmN0aW9uIG1ha2VTdGFydEJ1aWxkUGFyYW1zKCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIHNvdXJjZVZlcnNpb246IGV2ZW50LmRldGFpbC5zb3VyY2VDb21taXQgYXMgc3RyaW5nLFxuICAgICAgcHJvamVjdE5hbWU6IHByb2Nlc3MuZW52LkJVSUxEX1BST0pFQ1RfTkFNRSEsXG4gICAgICAvLyBXZSB3aWxsIHVzZSB0aGUgcHVsbCByZXF1ZXN0IGVudiB2YXJpYWJsZXMgbGF0ZXIgdG8gcG9zdCBhIGNvbW1lbnQgYWJvdXQgdGhlIGJ1aWxkIHRvIHRoZSBQUlxuICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXNPdmVycmlkZTogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0NPREVDT01NSVRfUFVMTF9SRVFVRVNUX0lEJyxcbiAgICAgICAgICB2YWx1ZTogZXZlbnQuZGV0YWlsLnB1bGxSZXF1ZXN0SWQsXG4gICAgICAgICAgdHlwZTogJ1BMQUlOVEVYVCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQ09ERUNPTU1JVF9QVUxMX1JFUVVFU1RfU1JDX0NPTU1JVCcsXG4gICAgICAgICAgdmFsdWU6IGV2ZW50LmRldGFpbC5zb3VyY2VDb21taXQsXG4gICAgICAgICAgdHlwZTogJ1BMQUlOVEVYVCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQ09ERUNPTU1JVF9QVUxMX1JFUVVFU1RfRFNUX0NPTU1JVCcsXG4gICAgICAgICAgdmFsdWU6IGV2ZW50LmRldGFpbC5kZXN0aW5hdGlvbkNvbW1pdCxcbiAgICAgICAgICB0eXBlOiAnUExBSU5URVhUJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtc1xuICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVCdWlsZEV2ZW50KGV2ZW50OiBhbnkpIHtcbiAgY29uc3QgcHVsbFJlcXVlc3RJZEVudlZhciA9IGV4dHJhY3RFbnZWYXJpYWJsZSgnQ09ERUNPTU1JVF9QVUxMX1JFUVVFU1RfSUQnKVxuICBjb25zdCBzb3VyY2VDb21taXRFbnZWYXIgPSBleHRyYWN0RW52VmFyaWFibGUoJ0NPREVDT01NSVRfUFVMTF9SRVFVRVNUX1NSQ19DT01NSVQnKVxuICBjb25zdCBkZXN0aW5hdGlvbkNvbW1pdEVudlZhciA9IGV4dHJhY3RFbnZWYXJpYWJsZSgnQ09ERUNPTU1JVF9QVUxMX1JFUVVFU1RfRFNUX0NPTU1JVCcpXG5cbiAgaWYgKGlzVHJpZ2dlcmVkRnJvbVB1bGxSZXF1ZXN0KCkpIHtcbiAgICBjb25zdCBjb21tZW50ID0gbWFrZUNvbW1lbnQoKVxuICAgIGNvbnN0IHJlcXVlc3RUb2tlbiA9IG1ha2VSZXF1ZXN0VG9rZW4oKVxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIGNvbnRlbnQ6IGNvbW1lbnQsXG4gICAgICBjbGllbnRSZXF1ZXN0VG9rZW46IHJlcXVlc3RUb2tlbixcbiAgICAgIGFmdGVyQ29tbWl0SWQ6IHNvdXJjZUNvbW1pdEVudlZhci52YWx1ZSxcbiAgICAgIHB1bGxSZXF1ZXN0SWQ6IHB1bGxSZXF1ZXN0SWRFbnZWYXIudmFsdWUsXG4gICAgICByZXBvc2l0b3J5TmFtZTogcHJvY2Vzcy5lbnYuUkVQT1NJVE9SWV9OQU1FISxcbiAgICAgIGJlZm9yZUNvbW1pdElkOiBkZXN0aW5hdGlvbkNvbW1pdEVudlZhci52YWx1ZSxcbiAgICB9XG5cbiAgICBsb2coeyBtZXNzYWdlOiAnUG9zdCBjb21tZW50IGZvciBQUicsIGRhdGE6IHBhcmFtcyB9KVxuICAgIGF3YWl0IGNvZGVjb21taXQucG9zdENvbW1lbnRGb3JQdWxsUmVxdWVzdChwYXJhbXMpLnByb21pc2UoKVxuICB9IGVsc2Uge1xuICAgIGxvZyh7IG1lc3NhZ2U6ICdOb3QgYSBwdWxsLXJlcXVlc3QgYnVpbGQnIH0pXG4gIH1cblxuICBmdW5jdGlvbiBleHRyYWN0RW52VmFyaWFibGUodmFyaWFibGU6IHN0cmluZykge1xuICAgIGNvbnN0IHZhcnMgPSBldmVudC5kZXRhaWxbJ2FkZGl0aW9uYWwtaW5mb3JtYXRpb24nXS5lbnZpcm9ubWVudFsnZW52aXJvbm1lbnQtdmFyaWFibGVzJ11cblxuICAgIHJldHVybiB2YXJzLmZpbmQoKGJ1aWxkRW52VmFyOiBhbnkpID0+IGJ1aWxkRW52VmFyLm5hbWUgPT0gdmFyaWFibGUpXG4gIH1cbiAgZnVuY3Rpb24gaXNUcmlnZ2VyZWRGcm9tUHVsbFJlcXVlc3QoKSB7XG4gICAgcmV0dXJuIHB1bGxSZXF1ZXN0SWRFbnZWYXIgJiYgc291cmNlQ29tbWl0RW52VmFyICYmIGRlc3RpbmF0aW9uQ29tbWl0RW52VmFyXG4gIH1cbiAgZnVuY3Rpb24gbWFrZUNvbW1lbnQoKSB7XG4gICAgcmV0dXJuIGBCdWlsZCAke21ha2VCdWlsZFN0YXR1c01lc3NhZ2UoKX0gJHttYWtlQnVpbGREZXRhaWxzTGlua01lc3NhZ2UoKX1gXG5cbiAgICBmdW5jdGlvbiBtYWtlQnVpbGRTdGF0dXNNZXNzYWdlKCkge1xuICAgICAgbGV0IG1lc3NhZ2UgPSAnJ1xuXG4gICAgICBjb25zdCBidWlsZFN0YXR1cyA9IGV2ZW50LmRldGFpbFsnYnVpbGQtc3RhdHVzJ11cbiAgICAgIHN3aXRjaCAoYnVpbGRTdGF0dXMpIHtcbiAgICAgICAgY2FzZSAnSU5fUFJPR1JFU1MnOlxuICAgICAgICAgIG1lc3NhZ2UgKz0gJ2lzICoqaW4gcHJvZ3Jlc3MqKi4nXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnU1VDQ0VFREVEJzpcbiAgICAgICAgICBtZXNzYWdlICs9ICcqKnN1Y2NlZWRlZCEqKidcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdTVE9QUEVEJzpcbiAgICAgICAgICBtZXNzYWdlICs9ICd3YXMgKipjYW5jZWxlZCoqLidcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdUSU1FRF9PVVQnOlxuICAgICAgICAgIG1lc3NhZ2UgKz0gJyoqdGltZWQgb3V0KiouJ1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbWVzc2FnZSArPSAnKipmYWlsZWQqKi4nXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtZXNzYWdlXG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VCdWlsZERldGFpbHNMaW5rTWVzc2FnZSgpIHtcbiAgICAgIGNvbnN0IHJlZ2lvbiA9IGV2ZW50LnJlZ2lvblxuICAgICAgY29uc3QgYnVpbGRBcm4gPSBldmVudC5kZXRhaWxbJ2J1aWxkLWlkJ11cbiAgICAgIGNvbnN0IGJ1aWxkSWQgPSBidWlsZEFybi5zcGxpdCgnLycpLnBvcCgpXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIGAgJm5ic3A7XG5cbiAgICAgICAgR28gdG8gdGhlIFtBV1MgQ29kZUJ1aWxkIGNvbnNvbGVdKGh0dHBzOlxcL1xcLyR7cmVnaW9ufS5jb25zb2xlLmF3cy5hbWF6b24uY29tXFwvY29kZWJ1aWxkXFwvaG9tZT9gICtcbiAgICAgICAgYHJlZ2lvbj0ke3JlZ2lvbn0jXFwvYnVpbGRzXFwvJHtlbmNvZGVVUkkoYnVpbGRJZCl9XFwvdmlld1xcL25ldykgdG8gdmlldyB0aGUgYnVpbGQgZGV0YWlscy5gXG4gICAgICApXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0VG9rZW4oKSB7XG4gICAgY29uc3QgYnVpbGRBcm4gPSBldmVudC5kZXRhaWxbJ2J1aWxkLWlkJ11cbiAgICBjb25zdCBidWlsZFN0YXR1cyA9IGV2ZW50LmRldGFpbFsnYnVpbGQtc3RhdHVzJ11cblxuICAgIHJldHVybiBidWlsZEFybiArIGJ1aWxkU3RhdHVzXG4gIH1cbn1cblxuZnVuY3Rpb24gbG9nKG9iajogYW55KSB7XG4gIGNvbnNvbGUubG9nKFxuICAgIHV0aWwuaW5zcGVjdChvYmosIHtcbiAgICAgIGNvbXBhY3Q6IGZhbHNlLFxuICAgICAgZGVwdGg6IDUsXG4gICAgICBicmVha0xlbmd0aDogMTAwLFxuICAgIH0pXG4gIClcbn1cbiJdfQ==