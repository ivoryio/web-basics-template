import React from "react"
import PropTypes from "prop-types"
import Input from "@kogaio/Input"
import { withValidation } from "../../decorators"

const ValidatedInput = props => <Input {...props} />

ValidatedInput.propTypes = {
  autoComplete: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
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
  ])
}

ValidatedInput.defaultProps = {
  type: "text"
}

export default withValidation(ValidatedInput)
