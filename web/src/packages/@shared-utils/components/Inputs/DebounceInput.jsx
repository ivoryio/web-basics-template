import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input } from '@kogaio'

import { useDebounce } from '../../hooks/useDebounce'
import { usePrevious } from '../../hooks/usePrevious'

export const DebounceInput = ({
  icLeft,
  debounceTimeout,
  id,
  label,
  minLength,
  onChange: handleDebounceCall,
  placeholder,
  ...props
}) => {
  const [term, updateTerm] = useState('')
  const _handleTermChange = ev => updateTerm(ev.target.value)

  const prevTerm = usePrevious(term.trim())
  useDebounce(
    async () => {
      const searchTerm = term.trim()
      if (prevTerm !== searchTerm) {
        if (searchTerm.length >= minLength) {
          await handleDebounceCall(term)
        } else {
          await handleDebounceCall('')
        }
      }
    },
    debounceTimeout,
    [term, handleDebounceCall]
  )

  return (
    <Input
      data-testid='debounce-input'
      icLeft={icLeft}
      id={id}
      onChange={_handleTermChange}
      label={label}
      placeholder={placeholder}
      value={term}
      {...props}
    />
  )
}

DebounceInput.propTypes = {
  icLeft: PropTypes.string,
  /**
   * @param {number} ms debounce time
   */
  debounceTimeout: PropTypes.number,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  /**
   * @param {string} searchTerm min length
   */
  minLength: PropTypes.number,
  /**
   * @param {string} searchTerm
   * executed after debounce timeout
   */
  onChange: PropTypes.func,
  placeholder: PropTypes.string
}

DebounceInput.defaultProps = {
  debounceTimeout: 300,
  minLength: 1,
  onChange: () => console.error('* DebounceInput expects an onChange function')
}

export default DebounceInput
