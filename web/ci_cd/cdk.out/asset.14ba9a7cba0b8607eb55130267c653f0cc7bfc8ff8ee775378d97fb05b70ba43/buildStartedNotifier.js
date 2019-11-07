"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codecommit_1 = __importDefault(require("aws-sdk/clients/codecommit"));
const codecommit = new codecommit_1.default();
module.exports.handler = async (event, context, callback) => {
    console.log(event);
    console.log(event.detail);
    if (event.detail && event.detail.event === 'pullRequestCreated') {
        const { sourceCommit, destinationCommit, pullRequestId, repositoryNames, } = event.detail;
        const content = 'Build started...';
        await codecommit
            .postCommentForPullRequest({
            content,
            pullRequestId,
            afterCommitId: sourceCommit,
            beforeCommitId: destinationCommit,
            repositoryName: repositoryNames[0],
        })
            .promise();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRTdGFydGVkTm90aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9sYW1iZGEvYnVpbGRTdGFydGVkTm90aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0RUFBbUQ7QUFFbkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxvQkFBVSxFQUFFLENBQUE7QUFFbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxPQUFZLEVBQUUsUUFBYSxFQUFFLEVBQUU7SUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUV6QixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssb0JBQW9CLEVBQUU7UUFDL0QsTUFBTSxFQUNKLFlBQVksRUFDWixpQkFBaUIsRUFDakIsYUFBYSxFQUNiLGVBQWUsR0FDaEIsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFBO1FBRWhCLE1BQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFBO1FBRWxDLE1BQU0sVUFBVTthQUNiLHlCQUF5QixDQUFDO1lBQ3pCLE9BQU87WUFDUCxhQUFhO1lBQ2IsYUFBYSxFQUFFLFlBQVk7WUFDM0IsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUNuQyxDQUFDO2FBQ0QsT0FBTyxFQUFFLENBQUE7S0FDYjtBQUNILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2RlQ29tbWl0IGZyb20gJ2F3cy1zZGsvY2xpZW50cy9jb2RlY29tbWl0J1xuXG5jb25zdCBjb2RlY29tbWl0ID0gbmV3IENvZGVDb21taXQoKVxuXG5tb2R1bGUuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ6IGFueSwgY2FsbGJhY2s6IGFueSkgPT4ge1xuICBjb25zb2xlLmxvZyhldmVudClcbiAgY29uc29sZS5sb2coZXZlbnQuZGV0YWlsKVxuXG4gIGlmIChldmVudC5kZXRhaWwgJiYgZXZlbnQuZGV0YWlsLmV2ZW50ID09PSAncHVsbFJlcXVlc3RDcmVhdGVkJykge1xuICAgIGNvbnN0IHtcbiAgICAgIHNvdXJjZUNvbW1pdCxcbiAgICAgIGRlc3RpbmF0aW9uQ29tbWl0LFxuICAgICAgcHVsbFJlcXVlc3RJZCxcbiAgICAgIHJlcG9zaXRvcnlOYW1lcyxcbiAgICB9ID0gZXZlbnQuZGV0YWlsXG5cbiAgICBjb25zdCBjb250ZW50ID0gJ0J1aWxkIHN0YXJ0ZWQuLi4nXG5cbiAgICBhd2FpdCBjb2RlY29tbWl0XG4gICAgICAucG9zdENvbW1lbnRGb3JQdWxsUmVxdWVzdCh7XG4gICAgICAgIGNvbnRlbnQsXG4gICAgICAgIHB1bGxSZXF1ZXN0SWQsXG4gICAgICAgIGFmdGVyQ29tbWl0SWQ6IHNvdXJjZUNvbW1pdCxcbiAgICAgICAgYmVmb3JlQ29tbWl0SWQ6IGRlc3RpbmF0aW9uQ29tbWl0LFxuICAgICAgICByZXBvc2l0b3J5TmFtZTogcmVwb3NpdG9yeU5hbWVzWzBdLFxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKClcbiAgfVxufVxuIl19