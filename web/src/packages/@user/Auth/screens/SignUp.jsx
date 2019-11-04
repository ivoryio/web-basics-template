import React from "react"
import PropTypes from "prop-types"
import { Formik, Form } from "formik"
import {
  Box,
  Button,
  Card,
  Flex,
  Image,
  Space,
  Touchable,
  Typography
} from "@kogaio"

import icons from "@user/assets/icons"
import { withSignUp } from "../decorators/withSignUp"
import { ValidatedInput } from "@shared/components"
import { isEmail, isPassword, hasValue } from "../validators"

const SignUp = ({
  authData,
  authState,
  onAuthEvent,
  onStateChange,
  requestSignUp,
  ...props
}) => {
  if (authState !== "signUp") return null

  return (
    <Flex
      alignItems='center'
      id='container-signup'
      justifyContent='center'
      {...props}>
      <Space mx={4} p={8} pt={{ xs: 24, lg: 8 }}>
        <Card
          alignItems='center'
          variant='light'
          display='flex'
          flexDirection='column'
          width={{ xs: 1, sm: 3 / 4, md: 3 / 5, lg: 1 / 2 }}>
          <Image mx='auto' size={120} src={icons.logo} />
          <Typography
            color='dark-gunmetal'
            fontWeight='bold'
            textAlign='center'
            variant='h2'>
            Sign Up Below!
          </Typography>
          <Formik
            initialValues={{
              email: authData ? authData.email : "",
              password: authData ? authData.password : "",
              firstName: "",
              familyName: ""
            }}
            onSubmit={requestSignUp}
            render={({
              handleSubmit,
              isSubmitting,
              status,
              values: { email, password, firstName, familyName }
            }) => (
              <Space mt={4}>
                <Form onSubmit={handleSubmit} noValidate>
                  <Flex flexWrap='wrap' justifyContent='center'>
                    <Space px={{ lg: 3 }}>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='signup-username'
                          id='email-input'
                          label='Email'
                          name='email'
                          placeholder='Email'
                          required
                          validMessage='Email validated!'
                          type='email'
                          validate={[hasValue, isEmail]}
                          value={email}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='signup-password'
                          id='password-input'
                          label='Password'
                          name='password'
                          passwordView='toggle'
                          placeholder='Password'
                          required
                          validMessage='Password validated!'
                          type='password'
                          value={password}
                          validate={[hasValue, isPassword]}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='signup-first-name'
                          id='firstname-input'
                          label='First Name'
                          name='firstName'
                          placeholder='First name'
                          required
                          validMessage='First name validated!'
                          value={firstName}
                          validate={[hasValue]}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='signup-last-name'
                          id='lastname-input'
                          label='Last Name'
                          name='familyName'
                          placeholder='Last name'
                          required
                          validMessage='Last name validated!'
                          validate={[hasValue]}
                          value={familyName}
                        />
                      </Box>
                    </Space>
                    <Space mt={1}>
                      <Box width={1}>
                        <Typography
                          color='error'
                          textAlign='center'
                          variant='h6'>
                          {status}
                        </Typography>
                      </Box>
                    </Space>
                    <Space mt={4}>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 3 / 7 }}>
                        <Button
                          disabled={isSubmitting}
                          loading={isSubmitting}
                          onTouchEnd={handleSubmit}
                          title='Sign Up'
                          type='submit'
                          width={1}
                        />
                      </Box>
                    </Space>
                  </Flex>
                </Form>
              </Space>
            )}
          />
          <Space mt={4}>
            <Touchable effect='opacity' onClick={() => onStateChange("signIn")}>
              <Typography variant='link'>
                Already have an account? Sign in!
              </Typography>
            </Touchable>
          </Space>
        </Card>
      </Space>
    </Flex>
  )
}

SignUp.propTypes = {
  authData: PropTypes.object,
  authState: PropTypes.string,
  onAuthEvent: PropTypes.func,
  onStateChange: PropTypes.func,
  requestSignUp: PropTypes.func
}

SignUp.defaultProps = {
  authData: {}
}

export default withSignUp(SignUp)
