import React from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'

import RadioButton from '../RadioButton'
import { withFieldValidation } from './withFieldValidation'

const ValidatedRadioButton = props => {
  const [
    { onChange: _notUsed, ...field },
    { error, touched, ...meta },
    helpers
  ] = useField(props)

  const _handleChange = async ev => {
    const { setError, setTouched, setValue } = helpers
    setTouched(true)
    setError('')
    await setValue(ev.target.value)
  }

  return (
    <RadioButton
      checked={field.name === meta.value}
      error={touched && error}
      onChange={_handleChange}
      {...field}
      {...meta}
      {...props}
    />
  )
}

ValidatedRadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  validate: PropTypes.arrayOf(PropTypes.func)
}

ValidatedRadioButton.defaultProps = {
  type: 'radio'
}

export default withFieldValidation(ValidatedRadioButton)
