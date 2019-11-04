import React from "react"
import { Auth } from "@user"
import { themeFactory } from "@kogaio"
import { ThemeProvider } from "styled-components"

import appTheme from "assets/theme"
import Router from "./navigation/Router"
import { GlobalStyle } from "assets/GlobalStyle"

const Root = () => (
  <ThemeProvider theme={themeFactory(appTheme)}>
    <Auth.AuthProvider>
      <GlobalStyle />
      <Router />
    </Auth.AuthProvider>
  </ThemeProvider>
)

export default Root
