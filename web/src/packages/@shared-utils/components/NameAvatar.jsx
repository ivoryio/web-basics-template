import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Typography } from '@kogaio'
import { themeGet } from '@kogaio/utils'

const NameAvatar = ({ initials, size, title, variant, ...props }) => (
  <Flex
    alignItems='center'
    height='fit-content'
    position='relative'
    title={title}
    width='fit-content'
    {...props}>
    <Hexagon size={size} viewBox='0 0 173.20508075688772 200'>
      <path d='M77.94228634059948 4.999999999999999Q86.60254037844386 0 95.26279441628824 4.999999999999999L164.54482671904333 45Q173.20508075688772 50 173.20508075688772 60L173.20508075688772 140Q173.20508075688772 150 164.54482671904333 155L95.26279441628824 195Q86.60254037844386 200 77.94228634059948 195L8.660254037844387 155Q0 150 0 140L0 60Q0 50 8.660254037844387 45Z'></path>
    </Hexagon>
    <Content>
      <Typography variant={variant} color='white' textStyle='caps'>
        {initials}
      </Typography>
    </Content>
  </Flex>
)

const Hexagon = styled.svg`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  fill: ${themeGet('colors.brand')};
`

const Content = styled(Flex)`
  align-items: center;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`

NameAvatar.propTypes = {
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initials: PropTypes.string,
  // typography variant
  variant: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ]),
  title: PropTypes.string
}

NameAvatar.defaultProps = {
  size: 40,
  variant: 'h6'
}

export default NameAvatar
