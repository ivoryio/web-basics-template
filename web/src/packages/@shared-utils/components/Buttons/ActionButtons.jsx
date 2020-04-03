import React from "react"
import PropTypes from "prop-types"
import { Button, Flex, Space } from "@kogaio"

/**
 * The default type for **save button** is *submit* and does not expect an onClick.
 *
 * This is useful when adding this set of buttons to forms.
 *
 * Passing an onClick property will set the button type to *button*.
 */
const ActionButtons = ({
  cancel,
  disabled,
  loading,
  save,
  saveLabel,
  ...props
}) => (
  <Flex alignItems='center' justifyContent='flex-end' {...props}>
    <Space mr={2}>
      <Button
        disabled={loading}
        data-testid='cancel-action-btn'
        title='Cancel'
        onClick={cancel}
        variant='outline'
      />
    </Space>
    <Space ml={2}>
      <Button
        disabled={loading || disabled}
        data-testid='save-action-btn'
        loading={loading}
        title={saveLabel}
        type={save ? "button" : "submit"}
        onClick={save ?? null}
      />
    </Space>
  </Flex>
)

ActionButtons.propTypes = {
  cancel: PropTypes.func,
  save: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  saveLabel: PropTypes.string
}

ActionButtons.defaultProps = {
  disabled: false,
  saveLabel: "Save"
}

export default ActionButtons
