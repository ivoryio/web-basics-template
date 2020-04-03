import React from "react"
import PropTypes from "prop-types"
import { useField } from "formik"

import { InputSkeleton } from "../Skeletons"
import CurrencyInput from "../Inputs/CurrencyInput"
import { withFieldValidation } from "./withFieldValidation"
import { positiveValue } from "@shared-utils/funcs"

const ValidatedCurrencyInput = ({
  isInitializing,
  CustomLoading,
  ...props
}) => {
  const [field, { error, touched, ...meta }] = useField(props)
  if (isInitializing) return CustomLoading ?? <InputSkeleton />
  return (
    <CurrencyInput error={touched && error} {...field} {...meta} {...props} />
  )
}

ValidatedCurrencyInput.propTypes = {
  autoComplete: PropTypes.string,
  CustomLoading: PropTypes.node,
  id: PropTypes.string.isRequired,
  isInitializing: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  step: PropTypes.number,
  required: PropTypes.bool,
  type: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.func)
}

ValidatedCurrencyInput.defaultProps = {
  type: "number"
}

export default withFieldValidation(ValidatedCurrencyInput, [positiveValue])
