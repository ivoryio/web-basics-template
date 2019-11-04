import React from "react"
import ReactDOM from "react-dom"

import Root from "./app/Root"
import Amplify from "aws-amplify"
import awsconfig from "./config/aws-exports"

Amplify.configure(awsconfig)

ReactDOM.render(<Root />, document.getElementById("root"))
