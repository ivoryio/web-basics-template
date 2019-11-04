import React from "react"

import Auth from "@aws-amplify/auth"

// weird error from eslint regarding onStateChange
// eslint-disable-next-line react/prop-types
export const withSignUp = SignUp => ({ onStateChange, ...props }) => {
  const signUp = async (values, actions) => {
    const { setStatus, setSubmitting } = actions
    setStatus(null)

    const { email, password, firstName, familyName } = values

    try {
      const response = await Auth.signUp({
        username: email,
        password,
        attributes: {
          given_name: firstName, /* eslint camelcase: 0 */
          family_name: familyName 
        }
      })

      if (response) onStateChange("signIn", { email: response.user.username })
      else setStatus("* Unexpected error caught. Please try again.")
    } catch (err) {
      if (typeof err === "object") return setStatus(`* ${err.message}`)
      setStatus(`* Error caught: ${err}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SignUp onStateChange={onStateChange} requestSignUp={signUp} {...props} />
  )
}
