import React, { useContext } from 'react'
import { Router } from '@reach/router'
import { Flex, Space } from '@kogaio'
import styled, { css } from 'styled-components'

import { Auth } from '@user'
import { SideMenu } from 'app/components'
import { ProtectedRoute } from './components'
import { Dashboard, NotFound, Auth as AuthRoute } from 'app/screens'

const AppRouter = () => {
  const { authed, currentUser } = useContext(Auth.AuthContext)

  return (
    <Flex flexDirection="column" width={1}>
      {authed ? <SideMenu user={currentUser} /> : null}
      <Wrapper className="app-body">
        <Space p={authed ? 6 : 0}>
          {/* Set false to prevent dumb scroll on navigation */}
          <Router primary={false}>
            <ProtectedRoute component={Dashboard} path="/" />
            <AuthRoute path="auth" />
            <NotFound default />
          </Router>
        </Space>
      </Wrapper>
    </Flex>
  )
}

const animateTransition = ({ authed, marginLeft }) =>
  authed &&
  css`
    transition: margin 330ms cubic-bezier(0.32, 1.25, 0.375, 1.15);
    margin-left: ${marginLeft};
  `

const Wrapper = styled(Flex)`
  flex-direction: column;
  height: 100%;
  ${animateTransition}
`

export default AppRouter
