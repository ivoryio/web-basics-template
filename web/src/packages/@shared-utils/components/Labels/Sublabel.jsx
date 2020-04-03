import React from 'react'
import PropTypes from 'prop-types'

import { Flex, Icon, Space, Typography } from '@kogaio'

const Sublabel = ({
  align,
  className,
  color,
  children,
  icon,
  ...passedProps
}) => (
  <Flex
    alignItems='center'
    className={className}
    justifyContent={align}
    height='12px'
    width={1}
    {...passedProps}>
    {icon ? (
      <Space pr={1}>
        <Icon color={color} fontSize={0} name={icon} />
      </Space>
    ) : null}
    <Typography color={color} display='block' fontSize={0}>
      {children}
    </Typography>
  </Flex>
)

Sublabel.propTypes = {
  align: PropTypes.oneOf(['flex-start', 'flex-end']),
  className: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.string.isRequired,
  icon: PropTypes.string
}

Sublabel.defaultProps = {
  align: 'flex-end',
  color: 'error',
  icon: 'error_outline'
}
Sublabel.displayName = 'Sublabel'

export default Sublabel
