import React from "react"
import { Router } from "@reach/router"
import { Flex, Space } from "@kogaio"
import styled, { css } from "styled-components"

import { ProtectedRoute } from "./components"
import { Dashboard, NotFound, Auth } from "app/screens"

const AppRouter = () => (
  <Flex flexDirection='column' width={1}>
    <Wrapper className='app-body'>
      <Space px={6} pt={8}>
        {/* Set false to prevent dumb scroll on navigation */}
        <Router primary={false}>
          <ProtectedRoute component={Dashboard} path='/' />
          <Auth path='auth' />
          <NotFound default />
        </Router>
      </Space>
    </Wrapper>
  </Flex>
)

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
