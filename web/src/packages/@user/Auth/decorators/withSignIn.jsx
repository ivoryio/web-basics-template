/* eslint react/prop-types: 0 */
import React from "react"
import Auth from "@aws-amplify/auth"
import { getQueryParam } from "@shared/funcs"

export const withSignIn = SignIn => ({ onStateChange, navigate, ...props }) => {
  const signIn = async ({ email, password }, actions) => {
    const { setStatus, setSubmitting } = actions
    setStatus(null)
    try {
      await Auth.signIn(email, password)
      redirectToStoredPath()
    } catch (err) {
      handleAuthError(err)
    } finally {
      setSubmitting(false)
    }

    function handleAuthError (err) {
      if (typeof err === "object") {
        const { message, code } = err
        if (code === "UserNotFoundException")
          return onStateChange("signUp", {
            email,
            password
          })

        return setStatus(`* ${message}`)
      }
      setStatus(`* Error caught: ${err}`)
    }
  }

  function redirectToStoredPath () {
    const redirectPath = getQueryParam("redirectTo") || "/"
    return navigate(redirectPath, { replace: true })
  }

  return (
    <SignIn onStateChange={onStateChange} requestSignIn={signIn} {...props} />
  )
}
