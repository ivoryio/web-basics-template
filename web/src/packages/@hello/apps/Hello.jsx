import React, { useState } from "react"
import PropTypes from "prop-types"

import Input from "@kogaio/Input"
import Button from "@kogaio/Button"
import Typography from "@kogaio/Typography"
import { Flex, Space } from "@kogaio/Responsive"
import ActivityIndicator from "@kogaio/ActivityIndicator"

import { withGreeting } from "../services/graphql/withGreeting"

const Hello = ({
  addError,
  addGreeting,
  addingGreeting,
  loading,
  greeting,
  ...props
}) => {
  const [newGreeting, storeNewGreeting] = useState("")
  const [showSuccess, setShowSuccess] = useState("")

  const _handleValueChange = ev => storeNewGreeting(ev.target.value)

  const _sendNewGreeting = () =>
    addGreeting(newGreeting)
      .then(() => storeNewGreeting(""))
      .finally(() => {
        _showSuccessFeedback()
      })

  const _showSuccessFeedback = () => {
    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
    }, 1500)
  }
  return (
    <Flex alignItems='center' flexDirection='column' justifyContent='center'>
      <Typography textAlign='center' variant='h3' {...props}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Typography>{greeting.message}</Typography>
        )}
      </Typography>
      <Space mt={4}>
        <Flex justifyContent='center'>
          <Space mx={1}>
            <Input
              alignItems='flex-start'
              id='new-greeting-input'
              onChange={_handleValueChange}
              placeholder='New greeting'
              value={newGreeting}
              error={addError}
              valid={showSuccess ? "Success!" : null}
            />
            <Button
              height='36px'
              loading={addingGreeting}
              disabled={addingGreeting || !newGreeting}
              onClick={_sendNewGreeting}
              title='Save'
            />
          </Space>
        </Flex>
      </Space>
    </Flex>
  )
}

Hello.propTypes = {
  addError: PropTypes.string,
  addGreeting: PropTypes.func,
  addingGreeting: PropTypes.bool,
  loading: PropTypes.bool,
  greeting: PropTypes.shape({
    message: PropTypes.string,
    __typename: PropTypes.string
  })
}

Hello.defaultProps = {
  greeting: {
    text: "Hello",
    id: "dummy",
    __typename: "Greeting"
  }
}

export default withGreeting(Hello)
