import gql from "graphql-tag"

export const GET_GREETING = gql`
  query {
    getRandomGreeting {
      data {
        message
      }
      error {
        code
        message
      }
      success
    }
  }
`
