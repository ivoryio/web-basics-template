import React, { useState } from 'react'
import PropTypes from 'prop-types'

import styled, { css } from 'styled-components'

import { Box, Chip, Flex, Input, Space, Typography } from '@kogaio'
import { themed, themeGet } from '@kogaio/utils'

const TagInput = ({
  containerStyle,
  id,
  label,
  name,
  readOnly,
  required,
  tagColor,
  value: tags,
  onChange: storeTags,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('')

  const _removeTag = i => {
    const newTags = [...tags]
    newTags.splice(i, 1)
    storeTags(newTags)
  }

  const _handleKeyDown = ev => {
    const val = ev.target.value.trim().toUpperCase()

    if (ev.key === 'Enter') {
      ev.preventDefault()
      _storeValue(val)
    } else if (ev.key === 'Backspace' && !val) _removeTag(tags.length - 1)
  }

  const _handleBlur = ev => {
    const val = ev.target.value.trim().toUpperCase()
    _storeValue(val)
  }

  const _storeValue = val => {
    if (!val) return
    const tagExists = tags.find(tag => tag.toLowerCase() === val.toLowerCase())
    if (tagExists) return

    storeTags([...tags, val])
    setInputValue('')
  }

  const _handleInputValue = ev => setInputValue(ev?.target?.value)

  const _focusInput = () =>
    document.activeElement !== document.getElementById(id)
      ? document.getElementById(id).focus()
      : null

  return (
    <Box {...containerStyle}>
      {label ? (
        <Typography
          as='label'
          display='block'
          htmlFor={id}
          className='taginput-label'
          variant='inputLabel'>
          {label} {required ? '*' : ''}
        </Typography>
      ) : null}
      <TagList as='ul' onClick={_focusInput} readOnly={readOnly}>
        {tags.length > 0
          ? tags.map((tag, i) => (
              <Chip
                as='li'
                className='tag-chip'
                fontFamily='primary'
                fontSize={0}
                fontWeight='bold'
                height='24px'
                key={tag}
                bg={tagColor}
                color='white'
                isRounded
                label={tag}
                onDismiss={readOnly ? null : () => _removeTag(i)}
              />
            ))
          : null}
        <Space ml={tags.length > 0 ? 1 : 0}>
          <InputWrapper readOnly={readOnly}>
            <Input
              bg={readOnly ? 'transparent' : 'input-bg'}
              disabled={readOnly}
              minHeight='36px'
              id={id}
              name={name}
              noBottomSpace
              onBlur={_handleBlur}
              onChange={_handleInputValue}
              onKeyDown={_handleKeyDown}
              placeholder={readOnly ? '' : 'Add a new tag'}
              value={inputValue}
              variant='tagInput'
              width={1}
              {...props}
            />
          </InputWrapper>
        </Space>
      </TagList>
    </Box>
  )
}

const readOnlyStyle = css`
  background-color: transparent;
  &:hover,
  &:focus-within {
    background-color: transparent;
    border: ${themeGet('borders.1')} transparent;
  }
`
const TagList = styled(Flex)`
  display: inline-flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  padding-left: ${({ readOnly }) => (readOnly ? 0 : themeGet('space.1'))}px;
  width: 100%;
  ${themed('TagInput')};

  .tag-chip {
    user-select: none;
    list-style: none;
    ${themed('TagInput.tag')};
  }
  ${({ readOnly }) => (readOnly ? readOnlyStyle : null)};
`

const InputWrapper = styled(Box)`
  background-color: transparent;
  display: ${({ readOnly }) => (readOnly ? 'none' : 'block')};
  flex-grow: 1;
  padding: 0;
  height: 100%;
`

TagInput.propTypes = {
  containerStyle: PropTypes.object,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  tagColor: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string)
}

TagInput.defaultProps = {
  tagColor: 'brand',
  readOnly: false
}

export default TagInput
