# Web Basics Template
The template for a basic Web SPA application built with React and AWS that offers basic user management features i.e. SignUp/SignIn


## Prerequisites
Please make sure you have the following tools to get started
* [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
* [aws cdk](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

Create a profile in `~/.aws/credentials` for your project

## Structure
This repo is structured as follows:    
```
├─ services           - backend services and infrastructure    
│  ├─ data-gateway      - schema and infrstructure for graphql (AppSync)    
│  ├─ user              - cognito user pool and lambdas necesary for user auth    
│  └─ greeter           - sample microservice offering CRUD for an entity    
│     ├─ infrastructure
│     └─ src              
│        ├─ delivery        - graphql resolvers and boilerplate
│        ├─ domain          - usecases, models
│        ├─ persistance     - repositories and mappers
│        └─ shared          - interfaces
└─ web                - react single page application
   ├─ ci_cd             - codecommit, s3, cloudfront, codebuild resources
   ├─ public
   └─ src
      ├─ app
      ├─ config
      │  └─ aws-exports.js  - amplify config
      ├─ packages         - the "microservices" of the frontend
      │  ├─ @hello          - sample package analougous to greeter microservice
      │  ├─ @shared-utils   - 
      │  └─ @user           - user authentication
      └─ styleguide       - styleguidist config
```

## Getting started

1. `git clone` this repo, or download a zip of the code
1. Once you have the code on your machine you may decide to split it based on one of these 3 strategies:
   1. split FE, data-gateway and each microservice. This is the intended way and there is infrastructure code that creates a codecommit repo in each of the microservices as well as the front-end.
   1. split FE - BE. Some assembly required.
   1. keep it together. Remove `.git`, run `git init` and you're done.
1. `npm install` dependencies in each project folder
1. Replace `xxx` with the project name. On FE you may also want to look for ivory or startekit
1. `cdk deploy -- --profile <your-profile>` in `data-gateway` and `user` projects (optionally `greeter` as well)
1. Add the `userPoolId`, `clientId` and `graphqlEndpoint` in `src/config/aws-exports.js` and make sure the `region` is correct
1. `npm start` and you should be able to sign up and login in the newly running app

Note: If you're getting a graphql error try running `npm run reinstall` on the front end.

