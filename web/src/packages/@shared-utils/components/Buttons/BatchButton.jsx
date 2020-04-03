import React from 'react'
import PropTypes from 'prop-types'

import {
  ActivityIndicator,
  Flex,
  Icon,
  Space,
  Touchable,
  Typography
} from '@kogaio'

const BatchButton = ({
  disabled,
  icon,
  isFetching,
  onClick,
  title,
  tooltip,
  ...props
}) => (
  <Touchable
    disabled={disabled}
    effect='opacity'
    onClick={onClick}
    title={tooltip || title}
    {...props}>
    <Flex alignItems='center'>
      {isFetching ? (
        <ActivityIndicator
          colors={{
            background: 'white',
            primary: disabled ? 'brand25' : 'brand'
          }}
          size={16}
        />
      ) : (
        <Icon color={disabled ? 'brand25' : 'brand'} fontSize={3} name={icon} />
      )}
      <Space ml={2}>
        <Typography color={disabled ? 'brand25' : 'brand'} variant='actionBtn'>
          {title}
        </Typography>
      </Space>
    </Flex>
  </Touchable>
)

BatchButton.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  isFetching: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  tooltip: PropTypes.string
}

BatchButton.defaultProps = {
  onClick: () => console.warn('* BatchButton expects an onClick function'),
  title: 'Button'
}

export default BatchButton
