import React from "react"
import { ApolloProvider } from "react-apollo"
import { appsyncClient } from "./services/graphql"

import { Auth } from "@user"
import { buildTheme } from "@kogaio/utils"
import { ThemeProvider } from "styled-components"

import appTheme from "assets/theme"
import Router from "./navigation/Router"
import { GlobalStyle } from "assets/GlobalStyle"

const Root = () => (
  <ApolloProvider client={appsyncClient}>
    <ThemeProvider theme={buildTheme(appTheme)}>
      <Auth.AuthProvider>
        <GlobalStyle />
        <Router />
      </Auth.AuthProvider>
    </ThemeProvider>
  </ApolloProvider>
)

export default Root
