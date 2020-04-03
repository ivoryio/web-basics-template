import React from "react"

import { Field } from "formik"
import { capitalizeFirstChar } from "../funcs"

export const withValidation = Component => props => {
  const { name, validate: validations, validMessage, value } = props

  const _validateField = () =>
    validations.length
      ? validations.reduce((acc, fn) => acc || fn(value), "")
      : ""

  const showValidFeedback = (touched, errors) => {
    if (!validMessage) return null

    if (touched[name] && !errors[name]) return capitalizeFirstChar(validMessage)
  }
  return (
    <Field
      name={name}
      validate={_validateField}
      >{({ field, form: { touched, errors }, ...rest }) => {
        const fieldProps = {
          ...field,
          ...rest,
          ...props,
          error: touched[name] && errors[name],
          name,
          valid: showValidFeedback(touched, errors)
        }
        
        return <Component {...fieldProps} />
      }}
    </Field>
  )
}
