import React, { createContext } from "react"
import PropTypes from "prop-types"

import { withAuthListener } from "./decorators/withAuthListener"

export const AuthContext = createContext()

export const AuthProvider = withAuthListener(
  ({ children, currentUser, ...props }) => {
    const authed = !currentUser
    return (
      <AuthContext.Provider
        value={{
          authed,
          currentUser,
          ...props
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }
)

AuthProvider.propTypes = {
  children: PropTypes.node,
  currentUser: PropTypes.object
}
