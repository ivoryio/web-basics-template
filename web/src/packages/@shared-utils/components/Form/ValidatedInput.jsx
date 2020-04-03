import React from "react"
import PropTypes from "prop-types"
import Input from "@kogaio/Input"
import { useField } from "formik"

import { InputSkeleton } from "../Skeletons"
import { withFieldValidation } from "./withFieldValidation"

const ValidatedInput = ({ isInitializing, CustomLoading, ...props }) => {
  const [field, { error, touched, ...meta }] = useField(props)
  if (isInitializing) return CustomLoading ?? <InputSkeleton />

  // Placeholder value to show on read only state
  if (
    !(props.value || field.value) &&
    props.emptyReadOnlyPlaceholder &&
    props.readOnly
  ) {
    return (
      <Input
        error={touched && error}
        {...field}
        {...meta}
        {...props}
        value={props.emptyReadOnlyPlaceholder}
      />
    )
  }

  return <Input error={touched && error} {...field} {...meta} {...props} />
}

ValidatedInput.propTypes = {
  autoComplete: PropTypes.string,
  CustomLoading: PropTypes.node,
  id: PropTypes.string.isRequired,
  isInitializing: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  emptyReadOnlyPlaceholder: PropTypes.string,
  value: PropTypes.any,
  validate: PropTypes.arrayOf(PropTypes.func)
}

ValidatedInput.defaultProps = {
  type: "text"
}

export default withFieldValidation(ValidatedInput)
