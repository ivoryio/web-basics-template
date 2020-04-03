import React, { useRef } from "react"
import PropTypes from "prop-types"
import { Flex, Input } from "@kogaio"

const CurrencyInput = ({ max, min, onChange, step, value, ...props }) => {
  const signs = useRef({
    plus: 187,
    minus: 189,
    eKey: 69
  })
  const _handleKeyPress = ev => {
    if (min >= 0) {
      if (Object.values(signs.current).includes(ev.keyCode))
        return ev.preventDefault()
    }
    return [signs.plus, signs.eKey].includes(ev.keyCode)
      ? ev.preventDefault()
      : null
  }

  return (
    <Flex width={1}>
      <Input
        icLeft='attach_money'
        max={max}
        min={min}
        onChange={onChange}
        onKeyDown={_handleKeyPress}
        pattern='(\d){0,16}'
        step={step}
        type='number'
        value={value}
        {...props}
      />
    </Flex>
  )
}

CurrencyInput.propTypes = {
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  icLeft: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
  /** dummy space added for consistent spacing with validated inputs.
   *
   * remove space by setting this to true */
  noBottomSpace: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ]),
  variant: PropTypes.string
}

CurrencyInput.defaultProps = {
  max: Number.MAX_SAFE_INTEGER,
  min: 0,
  placeholder: "Add amount",
  step: 1
}

export default CurrencyInput
