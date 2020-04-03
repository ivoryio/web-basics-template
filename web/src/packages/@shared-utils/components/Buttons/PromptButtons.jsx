import React from "react"
import PropTypes from "prop-types"

import { Flex, Space, Touchable, Typography } from "@kogaio"

import { ActiveButton } from "."

const PromptButtons = ({
  disabled,
  readOnly,
  onEdit,
  onCancel,
  onSave,
  title,
  ...props
}) => (
  <Flex justifyContent='space-between' {...props}>
    <Typography variant='titleLight'>{title || ""}&nbsp;</Typography>
    {readOnly ? (
      <ActiveButton
        data-testid='edit-toggle-btn'
        disabled={disabled}
        onClick={onEdit}
        label='Edit'
        icon='edit'
        icRounded
      />
    ) : (
      <Flex alignItems='center'>
        <Space mx={1}>
          <Touchable
            disabled={disabled}
            effect='opacity'
            onClick={onCancel}
            title='Cancel'
          >
            <Typography fontSize={0} textStyle='underline'>
              Cancel
            </Typography>
          </Touchable>
          <ActiveButton
            data-testid='save-action-btn'
            disabled={disabled}
            icon='check_circle'
            label='Save'
            onClick={onSave}
            title='Save'
          />
        </Space>
      </Flex>
    )}
  </Flex>
)

PromptButtons.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default PromptButtons
