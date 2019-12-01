/* eslint react/prop-types: 0 */
import React, { useState } from "react"

import { useMutation, useQuery } from "@apollo/react-hooks"

import { GET_GREETING } from "./queries"
import { ADD_GREETING } from "./mutations"

export const withGreeting = Component => props => {
  const [addError, setAddError] = useState(null)
  const [addingGreeting, setAddingGreeting] = useState(false)
  const { data, error, loading } = useQuery(GET_GREETING, {
    variables: { name: props.name }
  })

  const [requestAddGreeting] = useMutation(ADD_GREETING)

  let msg = { message: "" }
  if (data && data.getRandomGreeting && data.getRandomGreeting.data) {
    msg.message = data.getRandomGreeting.data.message || ""
  }

  const addGreeting = async newGreeting => {
    setAddingGreeting(true)
    try {
      const response = await requestAddGreeting({
        variables: {
          input: {
            salutation: newGreeting
          }
        },
        refetchQueries: [
          { query: GET_GREETING, variables: { name: props.name } }
        ],
        awaitRefetchQueries: true
      })

      setAddError(response.data.saveSalutation.error.message)
    } catch (err) {
      setAddError(err)
    } finally {
      setAddingGreeting(false)
    }
  }

  return (
    <Component
      addError={addError}
      addGreeting={addGreeting}
      addingGreeting={addingGreeting}
      greeting={msg}
      error={error}
      loading={loading}
      {...props}
    />
  )
}
