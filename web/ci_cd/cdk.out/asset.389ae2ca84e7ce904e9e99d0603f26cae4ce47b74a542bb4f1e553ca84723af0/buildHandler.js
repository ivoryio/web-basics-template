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
        log(event);
        if (isSourceCodeEvent(event)) {
            await handlePullRequestEvent(event);
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
async function handlePullRequestEvent(event) {
    if (isPullRequestEvent()) {
        codebuild.startBuild(makeStartBuildParams());
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
function log(obj) {
    console.log(util_1.default.inspect(obj, {
        compact: false,
        depth: 5,
        breakLength: 100,
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGFtYmRhL2J1aWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF1QjtBQUN2QiwwRUFBaUQ7QUFDakQsNEVBQW1EO0FBRW5ELE1BQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFBO0FBQ2pDLE1BQU0sVUFBVSxHQUFHLElBQUksb0JBQVUsRUFBRSxDQUFBO0FBRW5DLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFVLEVBQUUsRUFBRTtJQUM1QyxJQUFJO1FBQ0YsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRVYsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1QixNQUFNLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ3BDO0tBQ0Y7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNUO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxLQUFVO0lBQ25DLE9BQU8sQ0FDTCxLQUFLLENBQUMsTUFBTTtRQUNaLEtBQUssQ0FBQyxNQUFNLEtBQUssZ0JBQWdCO1FBQ2pDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxzQ0FBc0MsQ0FDaEUsQ0FBQTtBQUNILENBQUM7QUFFRCxLQUFLLFVBQVUsc0JBQXNCLENBQUMsS0FBVTtJQUM5QyxJQUFJLGtCQUFrQixFQUFFLEVBQUU7UUFDeEIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUE7S0FDN0M7U0FBTTtRQUNMLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxDQUFDLENBQUE7S0FDeEQ7SUFFRCxTQUFTLGtCQUFrQjtRQUN6QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUNwQyxPQUFPLFNBQVMsS0FBSyxvQkFBb0IsSUFBSSxTQUFTLEtBQUssZ0NBQWdDLENBQUE7SUFDN0YsQ0FBQztJQUNELFNBQVMsb0JBQW9CO1FBQzNCLE1BQU0sTUFBTSxHQUFHO1lBQ2IsYUFBYSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBc0I7WUFDbEQsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQW1CO1lBQzVDLCtGQUErRjtZQUMvRiw0QkFBNEIsRUFBRTtnQkFDNUI7b0JBQ0UsSUFBSSxFQUFFLDRCQUE0QjtvQkFDbEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYTtvQkFDakMsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2dCQUNEO29CQUNFLElBQUksRUFBRSxvQ0FBb0M7b0JBQzFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVk7b0JBQ2hDLElBQUksRUFBRSxXQUFXO2lCQUNsQjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsb0NBQW9DO29CQUMxQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7b0JBQ3JDLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0YsQ0FBQTtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLEdBQUcsQ0FBQyxHQUFRO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQ1QsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7UUFDaEIsT0FBTyxFQUFFLEtBQUs7UUFDZCxLQUFLLEVBQUUsQ0FBQztRQUNSLFdBQVcsRUFBRSxHQUFHO0tBQ2pCLENBQUMsQ0FDSCxDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlsIGZyb20gJ3V0aWwnXG5pbXBvcnQgQ29kZUJ1aWxkIGZyb20gJ2F3cy1zZGsvY2xpZW50cy9jb2RlYnVpbGQnXG5pbXBvcnQgQ29kZUNvbW1pdCBmcm9tICdhd3Mtc2RrL2NsaWVudHMvY29kZWNvbW1pdCdcblxuY29uc3QgY29kZWJ1aWxkID0gbmV3IENvZGVCdWlsZCgpXG5jb25zdCBjb2RlY29tbWl0ID0gbmV3IENvZGVDb21taXQoKVxuXG5tb2R1bGUuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnkpID0+IHtcbiAgdHJ5IHtcbiAgICBsb2coZXZlbnQpXG5cbiAgICBpZiAoaXNTb3VyY2VDb2RlRXZlbnQoZXZlbnQpKSB7XG4gICAgICBhd2FpdCBoYW5kbGVQdWxsUmVxdWVzdEV2ZW50KGV2ZW50KVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nKGVycilcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1NvdXJjZUNvZGVFdmVudChldmVudDogYW55KSB7XG4gIHJldHVybiAoXG4gICAgZXZlbnQuc291cmNlICYmXG4gICAgZXZlbnQuc291cmNlID09PSAnYXdzLmNvZGVjb21taXQnICYmXG4gICAgZXZlbnRbJ2RldGFpbC10eXBlJ10gPT09ICdDb2RlQ29tbWl0IFB1bGwgUmVxdWVzdCBTdGF0ZSBDaGFuZ2UnXG4gIClcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUHVsbFJlcXVlc3RFdmVudChldmVudDogYW55KSB7XG4gIGlmIChpc1B1bGxSZXF1ZXN0RXZlbnQoKSkge1xuICAgIGNvZGVidWlsZC5zdGFydEJ1aWxkKG1ha2VTdGFydEJ1aWxkUGFyYW1zKCkpXG4gIH0gZWxzZSB7XG4gICAgbG9nKHsgbWVzc2FnZTogJ05vdCBhIGJ1aWxkYWJsZSBwdWxsIHJlcXVlc3QgdXBkYXRlJyB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaXNQdWxsUmVxdWVzdEV2ZW50KCkge1xuICAgIGNvbnN0IGV2ZW50VHlwZSA9IGV2ZW50LmRldGFpbC5ldmVudFxuICAgIHJldHVybiBldmVudFR5cGUgPT09ICdwdWxsUmVxdWVzdENyZWF0ZWQnIHx8IGV2ZW50VHlwZSA9PT0gJ3B1bGxSZXF1ZXN0U291cmNlQnJhbmNoVXBkYXRlZCdcbiAgfVxuICBmdW5jdGlvbiBtYWtlU3RhcnRCdWlsZFBhcmFtcygpIHtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBzb3VyY2VWZXJzaW9uOiBldmVudC5kZXRhaWwuc291cmNlQ29tbWl0IGFzIHN0cmluZyxcbiAgICAgIHByb2plY3ROYW1lOiBwcm9jZXNzLmVudi5CVUlMRF9QUk9KRUNUX05BTUUhLFxuICAgICAgLy8gV2Ugd2lsbCB1c2UgdGhlIHB1bGwgcmVxdWVzdCBlbnYgdmFyaWFibGVzIGxhdGVyIHRvIHBvc3QgYSBjb21tZW50IGFib3V0IHRoZSBidWlsZCB0byB0aGUgUFJcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzT3ZlcnJpZGU6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdDT0RFQ09NTUlUX1BVTExfUkVRVUVTVF9JRCcsXG4gICAgICAgICAgdmFsdWU6IGV2ZW50LmRldGFpbC5wdWxsUmVxdWVzdElkLFxuICAgICAgICAgIHR5cGU6ICdQTEFJTlRFWFQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0NPREVDT01NSVRfUFVMTF9SRVFVRVNUX1NSQ19DT01NSVQnLFxuICAgICAgICAgIHZhbHVlOiBldmVudC5kZXRhaWwuc291cmNlQ29tbWl0LFxuICAgICAgICAgIHR5cGU6ICdQTEFJTlRFWFQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0NPREVDT01NSVRfUFVMTF9SRVFVRVNUX0RTVF9DT01NSVQnLFxuICAgICAgICAgIHZhbHVlOiBldmVudC5kZXRhaWwuZGVzdGluYXRpb25Db21taXQsXG4gICAgICAgICAgdHlwZTogJ1BMQUlOVEVYVCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXNcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2cob2JqOiBhbnkpIHtcbiAgY29uc29sZS5sb2coXG4gICAgdXRpbC5pbnNwZWN0KG9iaiwge1xuICAgICAgY29tcGFjdDogZmFsc2UsXG4gICAgICBkZXB0aDogNSxcbiAgICAgIGJyZWFrTGVuZ3RoOiAxMDAsXG4gICAgfSlcbiAgKVxufVxuIl19