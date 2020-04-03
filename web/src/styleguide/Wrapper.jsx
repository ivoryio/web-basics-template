import React from 'react'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'

import { Box } from '@kogaio/Responsive'
import { buildTheme } from '@kogaio/utils'

import starterkitTheme from '../app/assets/theme'

const Wrapper = ({ children }) => (
  <ThemeProvider theme={buildTheme(starterkitTheme)}>
    <Container>{children}</Container>
  </ThemeProvider>
)

const Container = styled(Box)`
  position: relative;
  inline-size: 100%;
`

Wrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.object]),
}

export default Wrapper
