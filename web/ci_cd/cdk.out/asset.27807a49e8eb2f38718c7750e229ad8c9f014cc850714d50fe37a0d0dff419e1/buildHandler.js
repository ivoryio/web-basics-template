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
            return (`Go to the [AWS CodeBuild console](https:\/\/${region}.console.aws.amazon.com\/codebuild\/home?` +
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
        depth: 8,
        breakLength: 100,
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGFtYmRhL2J1aWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF1QjtBQUN2QiwwRUFBaUQ7QUFDakQsNEVBQW1EO0FBRW5ELE1BQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFBO0FBQ2pDLE1BQU0sVUFBVSxHQUFHLElBQUksb0JBQVUsRUFBRSxDQUFBO0FBRW5DLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFVLEVBQUUsRUFBRTtJQUM1QyxJQUFJO1FBQ0YsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBRS9DLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNwQzthQUFNLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE1BQU0sZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDOUI7YUFBTTtZQUNMLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSwwREFBMEQsRUFBRSxDQUFDLENBQUE7U0FDN0U7S0FDRjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ1Q7QUFDSCxDQUFDLENBQUE7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEtBQVU7SUFDbkMsT0FBTyxDQUNMLEtBQUssQ0FBQyxNQUFNO1FBQ1osS0FBSyxDQUFDLE1BQU0sS0FBSyxnQkFBZ0I7UUFDakMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLHNDQUFzQyxDQUNoRSxDQUFBO0FBQ0gsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLEtBQVU7SUFDOUIsT0FBTyxDQUNMLEtBQUssQ0FBQyxNQUFNO1FBQ1os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Q0FBQTtZQUV6QyxPQUFPLENBQ0wsK0NBQStDLE1BQU0sMkNBQTJDO2dCQUNoRyxVQUFVLE1BQU0sY0FBYyxTQUFTLENBQUMsT0FBTyxDQUFDLHlDQUF5QyxDQUMxRixDQUFBO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxTQUFTLGdCQUFnQjtRQUN2QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3pDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7UUFFaEQsT0FBTyxRQUFRLEdBQUcsV0FBVyxDQUFBO0lBQy9CLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxHQUFHLENBQUMsR0FBUTtJQUNuQixPQUFPLENBQUMsR0FBRyxDQUNULGNBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2hCLE9BQU8sRUFBRSxLQUFLO1FBQ2QsS0FBSyxFQUFFLENBQUM7UUFDUixXQUFXLEVBQUUsR0FBRztLQUNqQixDQUFDLENBQ0gsQ0FBQTtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXRpbCBmcm9tICd1dGlsJ1xuaW1wb3J0IENvZGVCdWlsZCBmcm9tICdhd3Mtc2RrL2NsaWVudHMvY29kZWJ1aWxkJ1xuaW1wb3J0IENvZGVDb21taXQgZnJvbSAnYXdzLXNkay9jbGllbnRzL2NvZGVjb21taXQnXG5cbmNvbnN0IGNvZGVidWlsZCA9IG5ldyBDb2RlQnVpbGQoKVxuY29uc3QgY29kZWNvbW1pdCA9IG5ldyBDb2RlQ29tbWl0KClcblxubW9kdWxlLmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55KSA9PiB7XG4gIHRyeSB7XG4gICAgbG9nKHsgbWVzc2FnZTogJ0V2ZW50IHJlY2VpdmVkJywgZGF0YTogZXZlbnQgfSlcblxuICAgIGlmIChpc1NvdXJjZUNvZGVFdmVudChldmVudCkpIHtcbiAgICAgIGF3YWl0IGhhbmRsZVB1bGxSZXF1ZXN0RXZlbnQoZXZlbnQpXG4gICAgfSBlbHNlIGlmIChpc0J1aWxkRXZlbnQoZXZlbnQpKSB7XG4gICAgICBhd2FpdCBoYW5kbGVCdWlsZEV2ZW50KGV2ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2coeyBtZXNzYWdlOiAnTm90IGEgcHVsbC1yZXF1ZXN0LXJlbGF0ZWQgQ29kZUNvbW1pdCBvciBDb2RlQnVpbGQgZXZlbnQnIH0pXG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2coZXJyKVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzU291cmNlQ29kZUV2ZW50KGV2ZW50OiBhbnkpIHtcbiAgcmV0dXJuIChcbiAgICBldmVudC5zb3VyY2UgJiZcbiAgICBldmVudC5zb3VyY2UgPT09ICdhd3MuY29kZWNvbW1pdCcgJiZcbiAgICBldmVudFsnZGV0YWlsLXR5cGUnXSA9PT0gJ0NvZGVDb21taXQgUHVsbCBSZXF1ZXN0IFN0YXRlIENoYW5nZSdcbiAgKVxufVxuZnVuY3Rpb24gaXNCdWlsZEV2ZW50KGV2ZW50OiBhbnkpIHtcbiAgcmV0dXJuIChcbiAgICBldmVudC5zb3VyY2UgJiZcbiAgICBldmVudC5zb3VyY2UgPT0gJ2F3cy5jb2RlYnVpbGQnICYmXG4gICAgZXZlbnRbJ2RldGFpbC10eXBlJ10gPT09ICdDb2RlQnVpbGQgQnVpbGQgU3RhdGUgQ2hhbmdlJ1xuICApXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVB1bGxSZXF1ZXN0RXZlbnQoZXZlbnQ6IGFueSkge1xuICBpZiAoaXNQdWxsUmVxdWVzdEV2ZW50KCkpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBtYWtlU3RhcnRCdWlsZFBhcmFtcygpXG5cbiAgICBsb2coeyBtZXNzYWdlOiAnU3RhcnQgYnVpbGQnLCBkYXRhOiBwYXJhbXMgfSlcbiAgICBhd2FpdCBjb2RlYnVpbGQuc3RhcnRCdWlsZChwYXJhbXMpLnByb21pc2UoKVxuICB9IGVsc2Uge1xuICAgIGxvZyh7IG1lc3NhZ2U6ICdOb3QgYSBidWlsZGFibGUgcHVsbCByZXF1ZXN0IHVwZGF0ZScgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUHVsbFJlcXVlc3RFdmVudCgpIHtcbiAgICBjb25zdCBldmVudFR5cGUgPSBldmVudC5kZXRhaWwuZXZlbnRcbiAgICByZXR1cm4gZXZlbnRUeXBlID09PSAncHVsbFJlcXVlc3RDcmVhdGVkJyB8fCBldmVudFR5cGUgPT09ICdwdWxsUmVxdWVzdFNvdXJjZUJyYW5jaFVwZGF0ZWQnXG4gIH1cbiAgZnVuY3Rpb24gbWFrZVN0YXJ0QnVpbGRQYXJhbXMoKSB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgc291cmNlVmVyc2lvbjogZXZlbnQuZGV0YWlsLnNvdXJjZUNvbW1pdCBhcyBzdHJpbmcsXG4gICAgICBwcm9qZWN0TmFtZTogcHJvY2Vzcy5lbnYuQlVJTERfUFJPSkVDVF9OQU1FISxcbiAgICAgIC8vIFdlIHdpbGwgdXNlIHRoZSBwdWxsIHJlcXVlc3QgZW52IHZhcmlhYmxlcyBsYXRlciB0byBwb3N0IGEgY29tbWVudCBhYm91dCB0aGUgYnVpbGQgdG8gdGhlIFBSXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlc092ZXJyaWRlOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQ09ERUNPTU1JVF9QVUxMX1JFUVVFU1RfSUQnLFxuICAgICAgICAgIHZhbHVlOiBldmVudC5kZXRhaWwucHVsbFJlcXVlc3RJZCxcbiAgICAgICAgICB0eXBlOiAnUExBSU5URVhUJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdDT0RFQ09NTUlUX1BVTExfUkVRVUVTVF9TUkNfQ09NTUlUJyxcbiAgICAgICAgICB2YWx1ZTogZXZlbnQuZGV0YWlsLnNvdXJjZUNvbW1pdCxcbiAgICAgICAgICB0eXBlOiAnUExBSU5URVhUJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdDT0RFQ09NTUlUX1BVTExfUkVRVUVTVF9EU1RfQ09NTUlUJyxcbiAgICAgICAgICB2YWx1ZTogZXZlbnQuZGV0YWlsLmRlc3RpbmF0aW9uQ29tbWl0LFxuICAgICAgICAgIHR5cGU6ICdQTEFJTlRFWFQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUJ1aWxkRXZlbnQoZXZlbnQ6IGFueSkge1xuICBjb25zdCBwdWxsUmVxdWVzdElkRW52VmFyID0gZXh0cmFjdEVudlZhcmlhYmxlKCdDT0RFQ09NTUlUX1BVTExfUkVRVUVTVF9JRCcpXG4gIGNvbnN0IHNvdXJjZUNvbW1pdEVudlZhciA9IGV4dHJhY3RFbnZWYXJpYWJsZSgnQ09ERUNPTU1JVF9QVUxMX1JFUVVFU1RfU1JDX0NPTU1JVCcpXG4gIGNvbnN0IGRlc3RpbmF0aW9uQ29tbWl0RW52VmFyID0gZXh0cmFjdEVudlZhcmlhYmxlKCdDT0RFQ09NTUlUX1BVTExfUkVRVUVTVF9EU1RfQ09NTUlUJylcblxuICBpZiAoaXNUcmlnZ2VyZWRGcm9tUHVsbFJlcXVlc3QoKSkge1xuICAgIGNvbnN0IGNvbW1lbnQgPSBtYWtlQ29tbWVudCgpXG4gICAgY29uc3QgcmVxdWVzdFRva2VuID0gbWFrZVJlcXVlc3RUb2tlbigpXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgY29udGVudDogY29tbWVudCxcbiAgICAgIGNsaWVudFJlcXVlc3RUb2tlbjogcmVxdWVzdFRva2VuLFxuICAgICAgYWZ0ZXJDb21taXRJZDogc291cmNlQ29tbWl0RW52VmFyLnZhbHVlLFxuICAgICAgcHVsbFJlcXVlc3RJZDogcHVsbFJlcXVlc3RJZEVudlZhci52YWx1ZSxcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiBwcm9jZXNzLmVudi5SRVBPU0lUT1JZX05BTUUhLFxuICAgICAgYmVmb3JlQ29tbWl0SWQ6IGRlc3RpbmF0aW9uQ29tbWl0RW52VmFyLnZhbHVlLFxuICAgIH1cblxuICAgIGxvZyh7IG1lc3NhZ2U6ICdQb3N0IGNvbW1lbnQgZm9yIFBSJywgZGF0YTogcGFyYW1zIH0pXG4gICAgYXdhaXQgY29kZWNvbW1pdC5wb3N0Q29tbWVudEZvclB1bGxSZXF1ZXN0KHBhcmFtcykucHJvbWlzZSgpXG4gIH0gZWxzZSB7XG4gICAgbG9nKHsgbWVzc2FnZTogJ05vdCBhIHB1bGwtcmVxdWVzdCBidWlsZCcgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4dHJhY3RFbnZWYXJpYWJsZSh2YXJpYWJsZTogc3RyaW5nKSB7XG4gICAgY29uc3QgdmFycyA9IGV2ZW50LmRldGFpbFsnYWRkaXRpb25hbC1pbmZvcm1hdGlvbiddLmVudmlyb25tZW50WydlbnZpcm9ubWVudC12YXJpYWJsZXMnXVxuXG4gICAgcmV0dXJuIHZhcnMuZmluZCgoYnVpbGRFbnZWYXI6IGFueSkgPT4gYnVpbGRFbnZWYXIubmFtZSA9PSB2YXJpYWJsZSlcbiAgfVxuICBmdW5jdGlvbiBpc1RyaWdnZXJlZEZyb21QdWxsUmVxdWVzdCgpIHtcbiAgICByZXR1cm4gcHVsbFJlcXVlc3RJZEVudlZhciAmJiBzb3VyY2VDb21taXRFbnZWYXIgJiYgZGVzdGluYXRpb25Db21taXRFbnZWYXJcbiAgfVxuICBmdW5jdGlvbiBtYWtlQ29tbWVudCgpIHtcbiAgICByZXR1cm4gYEJ1aWxkICR7bWFrZUJ1aWxkU3RhdHVzTWVzc2FnZSgpfSAke21ha2VCdWlsZERldGFpbHNMaW5rTWVzc2FnZSgpfWBcblxuICAgIGZ1bmN0aW9uIG1ha2VCdWlsZFN0YXR1c01lc3NhZ2UoKSB7XG4gICAgICBsZXQgbWVzc2FnZSA9ICcnXG5cbiAgICAgIGNvbnN0IGJ1aWxkU3RhdHVzID0gZXZlbnQuZGV0YWlsWydidWlsZC1zdGF0dXMnXVxuICAgICAgc3dpdGNoIChidWlsZFN0YXR1cykge1xuICAgICAgICBjYXNlICdJTl9QUk9HUkVTUyc6XG4gICAgICAgICAgbWVzc2FnZSArPSAnaXMgKippbiBwcm9ncmVzcyoqLidcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdTVUNDRUVERUQnOlxuICAgICAgICAgIG1lc3NhZ2UgKz0gJyoqc3VjY2VlZGVkISoqJ1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1NUT1BQRUQnOlxuICAgICAgICAgIG1lc3NhZ2UgKz0gJ3dhcyAqKmNhbmNlbGVkKiouJ1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1RJTUVEX09VVCc6XG4gICAgICAgICAgbWVzc2FnZSArPSAnKip0aW1lZCBvdXQqKi4nXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBtZXNzYWdlICs9ICcqKmZhaWxlZCoqLidcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lc3NhZ2VcbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZUJ1aWxkRGV0YWlsc0xpbmtNZXNzYWdlKCkge1xuICAgICAgY29uc3QgcmVnaW9uID0gZXZlbnQucmVnaW9uXG4gICAgICBjb25zdCBidWlsZEFybiA9IGV2ZW50LmRldGFpbFsnYnVpbGQtaWQnXVxuICAgICAgY29uc3QgYnVpbGRJZCA9IGJ1aWxkQXJuLnNwbGl0KCcvJykucG9wKClcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgYEdvIHRvIHRoZSBbQVdTIENvZGVCdWlsZCBjb25zb2xlXShodHRwczpcXC9cXC8ke3JlZ2lvbn0uY29uc29sZS5hd3MuYW1hem9uLmNvbVxcL2NvZGVidWlsZFxcL2hvbWU/YCArXG4gICAgICAgIGByZWdpb249JHtyZWdpb259I1xcL2J1aWxkc1xcLyR7ZW5jb2RlVVJJKGJ1aWxkSWQpfVxcL3ZpZXdcXC9uZXcpIHRvIHZpZXcgdGhlIGJ1aWxkIGRldGFpbHMuYFxuICAgICAgKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtYWtlUmVxdWVzdFRva2VuKCkge1xuICAgIGNvbnN0IGJ1aWxkQXJuID0gZXZlbnQuZGV0YWlsWydidWlsZC1pZCddXG4gICAgY29uc3QgYnVpbGRTdGF0dXMgPSBldmVudC5kZXRhaWxbJ2J1aWxkLXN0YXR1cyddXG5cbiAgICByZXR1cm4gYnVpbGRBcm4gKyBidWlsZFN0YXR1c1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvZyhvYmo6IGFueSkge1xuICBjb25zb2xlLmxvZyhcbiAgICB1dGlsLmluc3BlY3Qob2JqLCB7XG4gICAgICBjb21wYWN0OiBmYWxzZSxcbiAgICAgIGRlcHRoOiA4LFxuICAgICAgYnJlYWtMZW5ndGg6IDEwMCxcbiAgICB9KVxuICApXG59XG4iXX0=