import gql from "graphql-tag"

export const ADD_GREETING = gql`
  mutation($input: SaveSalutationInput!) {
    saveSalutation(input: $input) {
      error {
        code
        message
      }
      success
    }
  }
`
