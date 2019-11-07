"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codecommit_1 = __importDefault(require("aws-sdk/clients/codecommit"));
const codecommit = new codecommit_1.default();
module.exports.handler = async (event, context, callback) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRTdGFydGVkTm90aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9sYW1iZGEvYnVpbGRTdGFydGVkTm90aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0RUFBbUQ7QUFFbkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxvQkFBVSxFQUFFLENBQUE7QUFFbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxPQUFZLEVBQUUsUUFBYSxFQUFFLEVBQUU7SUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFekIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLG9CQUFvQixFQUFFO1FBQy9ELE1BQU0sRUFDSixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixlQUFlLEdBQ2hCLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQTtRQUVoQixNQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQTtRQUVsQyxNQUFNLFVBQVU7YUFDYix5QkFBeUIsQ0FBQztZQUN6QixPQUFPO1lBQ1AsYUFBYTtZQUNiLGFBQWEsRUFBRSxZQUFZO1lBQzNCLGNBQWMsRUFBRSxpQkFBaUI7WUFDakMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7U0FDbkMsQ0FBQzthQUNELE9BQU8sRUFBRSxDQUFBO0tBQ2I7QUFDSCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29kZUNvbW1pdCBmcm9tICdhd3Mtc2RrL2NsaWVudHMvY29kZWNvbW1pdCdcblxuY29uc3QgY29kZWNvbW1pdCA9IG5ldyBDb2RlQ29tbWl0KClcblxubW9kdWxlLmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0OiBhbnksIGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgY29uc29sZS5sb2coZXZlbnQuZGV0YWlsKVxuXG4gIGlmIChldmVudC5kZXRhaWwgJiYgZXZlbnQuZGV0YWlsLmV2ZW50ID09PSAncHVsbFJlcXVlc3RDcmVhdGVkJykge1xuICAgIGNvbnN0IHtcbiAgICAgIHNvdXJjZUNvbW1pdCxcbiAgICAgIGRlc3RpbmF0aW9uQ29tbWl0LFxuICAgICAgcHVsbFJlcXVlc3RJZCxcbiAgICAgIHJlcG9zaXRvcnlOYW1lcyxcbiAgICB9ID0gZXZlbnQuZGV0YWlsXG5cbiAgICBjb25zdCBjb250ZW50ID0gJ0J1aWxkIHN0YXJ0ZWQuLi4nXG5cbiAgICBhd2FpdCBjb2RlY29tbWl0XG4gICAgICAucG9zdENvbW1lbnRGb3JQdWxsUmVxdWVzdCh7XG4gICAgICAgIGNvbnRlbnQsXG4gICAgICAgIHB1bGxSZXF1ZXN0SWQsXG4gICAgICAgIGFmdGVyQ29tbWl0SWQ6IHNvdXJjZUNvbW1pdCxcbiAgICAgICAgYmVmb3JlQ29tbWl0SWQ6IGRlc3RpbmF0aW9uQ29tbWl0LFxuICAgICAgICByZXBvc2l0b3J5TmFtZTogcmVwb3NpdG9yeU5hbWVzWzBdLFxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKClcbiAgfVxufVxuIl19