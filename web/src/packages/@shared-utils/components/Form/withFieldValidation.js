import React from "react"

import { Field } from "formik"
import { required as requiredRule } from "../../funcs/validators"

export const withFieldValidation = (Component, defaultValidations = []) => ({
  name,
  validate = [],
  ...props
}) => {
  const _validateField = value => {
    const validationRules = props.required
      ? [requiredRule, ...defaultValidations, ...validate]
      : validate
    return validationRules.length > 0
      ? validationRules.reduce((acc, fn) => acc || fn(value), "")
      : ""
  }

  return (
    <Field name={name} validate={_validateField}>
      {() => <Component name={name} {...props} />}
    </Field>
  )
}
