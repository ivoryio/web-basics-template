# Web Basics Template
The template for a basic Web SPA application built with React and AWS that offers basic user management features i.e. SignUp/SignIn


## Prerequisites
Please make sure you have the following tools to get started
* [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
* [aws cdk](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)


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
