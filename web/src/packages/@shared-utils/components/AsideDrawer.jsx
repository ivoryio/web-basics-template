import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { Box, Space } from "@kogaio"

const CONTENT_WIDTH = 280 + 6 * 4 * 2
export const AsideDrawer = ({ children, ...props }) => (
  <Space px={6}>
    <Container as='aside' bg='white' width={`${CONTENT_WIDTH}px`} {...props}>
      {children}
    </Container>
  </Space>
)

const Container = styled(Box)`
  flex: 0 0 328px;
`

AsideDrawer.propTypes = {
  children: PropTypes.node
}
