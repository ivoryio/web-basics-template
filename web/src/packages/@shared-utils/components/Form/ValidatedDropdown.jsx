import React from "react"
import PropTypes from "prop-types"
import Dropdown from "@kogaio/Dropdown"
import { useField } from "formik"

import { InputSkeleton } from "../Skeletons"
import { withFieldValidation } from "./withFieldValidation"

const ValidatedDropdown = ({ CustomLoading, isInitializing, ...props }) => {
  const [
    { onBlur: __notUsed, onChange: _notUsed, ...field },
    { error, touched, ...meta },
    helpers
  ] = useField(props)
  const _handleChange = newValue => {
    const { setValue } = helpers
    setValue(newValue)
  }

  if (isInitializing) return CustomLoading ?? <InputSkeleton />

  // Placeholder value to show on read only state
  if (!field.value && props.emptyReadOnlyPlaceholder && props.readOnly) {
    return (
      <Dropdown
        onChange={_handleChange}
        error={touched && error}
        {...field}
        {...meta}
        {...props}
        value={props.emptyReadOnlyPlaceholder}
      />
    )
  }

  return (
    <Dropdown
      {...field}
      {...meta}
      {...props}
      error={touched && error}
      onChange={props.onChange ?? _handleChange}
    />
  )
}

ValidatedDropdown.propTypes = {
  autoComplete: PropTypes.string,
  "data-testid": PropTypes.string,
  children: PropTypes.node,
  CustomLoading: PropTypes.node,
  id: PropTypes.string,
  isInitializing: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  validMessage: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.func),
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.string
  ]),
  emptyReadOnlyPlaceholder: PropTypes.string,
  readOnly: PropTypes.bool
}

export default withFieldValidation(ValidatedDropdown)
