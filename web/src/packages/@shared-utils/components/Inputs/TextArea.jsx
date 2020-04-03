import React, { useCallback, useLayoutEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { Sublabel } from '../Labels'
import { Box, Flex, Space, Typography } from '@kogaio'

import { themed } from '@kogaio/utils'
import { variant } from 'styled-system'

const textareaStyle = variant({
  scale: 'textareas',
  prop: 'variant'
})

const TextArea = ({
  autoFocus,
  autoGrow,
  children,
  containerStyle,
  disabled,
  form,
  cols,
  error,
  id,
  label,
  maxLength,
  name,
  noBottomSpace,
  onChange: handleValueChange,
  onKeyUp,
  placeholder,
  readOnly,
  required,
  rows,
  valid,
  variant,
  wrap,
  ...props
}) => {
  const autoGrowTextArea = useCallback(() => {
    const oField = document.getElementById(id)
    if (oField.scrollHeight > oField.clientHeight) {
      oField.style.height = `${oField.scrollHeight}px`
      oField.style.overflowY = 'hidden'
    }
  }, [id])

  useLayoutEffect(() => {
    if (autoGrow) autoGrowTextArea()
  }, [autoGrow, autoGrowTextArea])

  const textareaVariant = useMemo(() => {
    if (disabled) return 'disabled'
    else if (error) return 'error'
    else if (valid) return 'valid'
    return variant
  }, [disabled, error, valid, variant])

  const handleOnKeyUp = ev => {
    if (autoGrow) autoGrowTextArea()
    if (onKeyUp) return onKeyUp(ev)
  }

  return (
    <Container flexDirection='column' {...containerStyle}>
      {label ? (
        <Typography
          as='label'
          className='textarea-label'
          display='block'
          htmlFor={id}
          variant='inputLabel'>
          {label} {required ? '*' : ''}
        </Typography>
      ) : null}
      <Space p={3}>
        <TextAreaComponent
          as='textarea'
          autoFocus={autoFocus}
          disabled={disabled}
          form={form}
          cols={cols}
          id={id}
          maxLength={maxLength}
          name={name}
          onChange={handleValueChange}
          onKeyUp={handleOnKeyUp}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          rows={rows}
          variant={textareaVariant}
          wrap={wrap}
          {...props}>
          {children}
        </TextAreaComponent>
      </Space>
      {[error, valid].some(item => typeof item === 'string') ? (
        <Space my={1}>
          <Sublabel
            className='textarea-sublabel'
            type={error ? 'error' : 'valid'}>
            {error ?? valid}
          </Sublabel>
        </Space>
      ) : (
        <Dummy hide={noBottomSpace} />
      )}
    </Container>
  )
}

const readOnlyStyle = css`
  background-color: transparent;
  border: none;
  padding-left: 0;
  padding-right: 0;

  :focus,
  :hover {
    border: none;
    background-color: none;
  }
`
const Container = styled(Flex)`
  ${themed('TextArea.container')};
`

const TextAreaComponent = styled(Box)`
  :focus {
    outline: none;
  }

  ${themed('TextArea')};
  ${textareaStyle};
  ${({ readOnly }) => (readOnly ? readOnlyStyle : null)};
`

const Dummy = styled.div`
  display: ${({ hide }) => (hide ? 'none' : 'block')};
  height: 20px;
  opacity: 0;
  visibility: hidden;
`

TextArea.propTypes = {
  autoFocus: PropTypes.bool,
  autoGrow: PropTypes.bool,
  children: PropTypes.node,
  containerStyle: PropTypes.object,
  cols: PropTypes.number,
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  id: PropTypes.string,
  form: PropTypes.string,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string,
  noBottomSpace: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  valid: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  variant: PropTypes.string,
  wrap: PropTypes.oneOf(['hard', 'soft'])
}

TextArea.defaultProps = {
  variant: 'default',
  onChange: () => console.warn('* TextArea expects an onChange function')
}

export default TextArea
