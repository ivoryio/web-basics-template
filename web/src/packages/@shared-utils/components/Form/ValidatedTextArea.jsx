import React from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'

import TextArea from '../Inputs/TextArea'
import { withFieldValidation } from './withFieldValidation'

const ValidatedTextArea = props => {
  const [field, { error, touched, ...meta }] = useField(props)

  // Placeholder value to show on read only state
  if (!field.value && props.emptyReadOnlyPlaceholder && props.readOnly) {
    return (
      <TextArea
        error={touched && error}
        {...field}
        {...meta}
        {...props}
        value={props.emptyReadOnlyPlaceholder}
      />
    )
  }

  return <TextArea error={touched && error} {...field} {...meta} {...props} />
}

ValidatedTextArea.propTypes = {
  autoComplete: PropTypes.string,
  autoGrow: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  emptyReadOnlyPlaceholder: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.func)
}

export default withFieldValidation(ValidatedTextArea)
