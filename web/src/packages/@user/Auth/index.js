import React from "react"
import PropTypes from "prop-types"
import { Authenticator } from "aws-amplify-react"
import { getQueryParam } from "@shared-utils/funcs"

import { SignIn, SignUp } from "./screens"
import { AuthProvider, AuthContext } from "./AuthContext"

const SignInSignUp = props => {
  function _handleStateChange (newState) {
    console.info("AUTH STATE CHANGE:", newState)
  }

  return (
    <Authenticator
      id='authenticator'
      onStateChange={_handleStateChange}
      authState={getQueryParam("state")}
      hideDefault
    >
      <SignUp {...props} />
      <SignIn {...props} />
    </Authenticator>
  )
}

SignInSignUp.propTypes = {
  location: PropTypes.object,
  navigate: PropTypes.func
}

export const Auth = {
  AuthContext,
  AuthProvider,
  SignInSignUp
}
