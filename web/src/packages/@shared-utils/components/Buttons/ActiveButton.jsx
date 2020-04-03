import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Flex, Space, Touchable, Typography } from '@kogaio'

import RoundedIcon from '../RoundedIcon'

const ActiveButton = ({
  flexDirection,
  icRounded,
  disabled,
  icon,
  label,
  onClick,
  ...props
}) => (
  <Touchable
    disabled={disabled}
    display='contents'
    effect='opacity'
    onClick={onClick}
    title={label}
    type={onClick ? 'button' : 'submit'}>
    <Flex alignItems='center' flexDirection={flexDirection} {...props}>
      {icRounded ? (
        <RoundedIcon disabled={disabled} fontSize={0} name={icon} />
      ) : (
        <Icon color={disabled ? 'brand25' : 'brand'} fontSize={2} name={icon} />
      )}
      <Space
        pl={flexDirection === 'row' ? 1 : 0}
        pr={flexDirection === 'row-reverse' ? 1 : 0}>
        <Typography
          color={disabled ? 'brand25' : 'brand'}
          fontSize={0}
          fontWeight='bold'
          textStyle='caps'>
          {label}
        </Typography>
      </Space>
    </Flex>
  </Touchable>
)

ActiveButton.propTypes = {
  disabled: PropTypes.bool,
  flexDirection: PropTypes.string,
  icon: PropTypes.string,
  icRounded: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func
}

ActiveButton.defaultProps = {
  disabled: false,
  flexDirection: 'row',
  icRounded: false
}

export default ActiveButton
