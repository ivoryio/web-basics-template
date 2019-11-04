import React, { Children, cloneElement, useContext } from "react"
import PropTypes from "prop-types"
import { Redirect } from "@reach/router"
import qs from "query-string"

import { Auth } from "@user"
import { withLocation } from "../withLocation"

const withRestrictedAccess = Route => ({ ...props }) => {
  const { authed, currentUser } = useContext(Auth.AuthContext)

  const isAllowedToAccess = (() => {
    if (!currentUser) return false
    return true
  })()

  return (
    <Route
      authed={authed}
      currentUser={currentUser}
      isAllowedToAccess={isAllowedToAccess}
      {...props}
    />
  )
}

const ProtectedRoute = ({
  authed,
  children: childRoute,
  currentUser,
  component: Component,
  isAllowedToAccess,
  location: { pathname, ...location },
  ...rest
}) => {
  const queryString = (() => {
    const { search } = location
    return qs.stringify({
      ...qs.parse(search),
      redirectTo: pathname
    })
  })()

  if (!currentUser) {
    return (
      <Redirect
        from={pathname}
        to={pathname.length > 1 ? `/auth?${queryString}` : "/auth?state=signIn"}
        noThrow
      />
    )
  }

  if (!isAllowedToAccess) return <Redirect to='/' noThrow />

  const nestedRoute = extendChildRoute(childRoute, {
    authed,
    currentUser,
    pathname
  })

  return Component ? (
    <Component
      currentUser={currentUser}
      pathname={pathname}
      {...location}
      {...rest}
    />
  ) : (
    nestedRoute
  )
}

function extendChildRoute (initialChild, props) {
  if (!initialChild) return null
  return cloneElement(initialChild, {
    children: Children.map(initialChild.props.children, child =>
      cloneElement(child, {
        ...props
      })
    )
  })
}

ProtectedRoute.propTypes = {
  authed: PropTypes.bool,
  children: PropTypes.node,
  currentUser: PropTypes.object,
  component: PropTypes.func,
  isAllowedToAccess: PropTypes.bool,
  location: PropTypes.object
}

export default withLocation(withRestrictedAccess(ProtectedRoute))
