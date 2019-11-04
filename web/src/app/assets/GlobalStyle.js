import { themeGet } from "@kogaio/utils"
import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    scroll-behavior: smooth;
  }
  
  body {
    height: 100%;
    margin: ${themeGet("space.0")}px;
    padding: ${themeGet("space.0")}px;
    font-family: ${themeGet("fonts.primary")};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    width: 100%;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  .route-link:not(.underlined) {
    text-decoration: none;
  }

  .route-link:active, .route-link:hover:not(:disabled) {
    opacity: 0.75;
  }

  .matched-substr {
    border-bottom: ${themeGet("borders.2")} ${themeGet(
  "colors.brand-secondary"
)};
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
`
