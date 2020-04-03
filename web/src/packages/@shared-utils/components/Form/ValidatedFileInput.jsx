import React from "react"
import PropTypes from "prop-types"
import { useField } from "formik"

import { FileInput } from "../Inputs/FileInput"

import { withFieldValidation } from "./withFieldValidation"

const ValidatedFileInput = props => {
  const [
    { onChange: _notUsed, ...field },
    { error, touched, ...meta },
    helpers
  ] = useField(props)

  const _handleChange = async files => {
    const { setTouched, setValue } = helpers
    setTouched(true)
    await setValue(files)
  }

  return (
    <FileInput
      error={touched && error}
      onChange={_handleChange}
      {...field}
      {...meta}
      {...props}
    />
  )
}

ValidatedFileInput.propTypes = {
  accept: PropTypes.string,
  buttonLabel: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  id: PropTypes.string,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  noBottomSpace: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  sublabel: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.func),
  value: PropTypes.object
}

export default withFieldValidation(ValidatedFileInput)
