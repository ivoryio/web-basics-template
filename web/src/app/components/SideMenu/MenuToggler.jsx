import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { Flex, Icon, Space, Touchable, Typography } from "@kogaio"

const MenuToggler = ({ isExpanded, toggleMenu, ...props }) => (
  <Flex
    alignItems='center'
    bg='brand'
    borderTop={1}
    borderColor='sidemenu-item'
    height='40px'
    width={1}
    {...props}
  >
    <Touchable
      alignItems='center'
      effect='opacity'
      display='flex'
      onClick={toggleMenu}
      title='Toggle Menu'
    >
      <ToggleIcon
        fontSize={2}
        color='sidemenu-item'
        isExpanded={isExpanded}
        name='arrow_drop_down_circle'
      />
      <Space ml={3}>
        <Title color='sidemenu-item' fontSize={1} isVisible={isExpanded}>
          Close Menu
        </Title>
      </Space>
    </Touchable>
  </Flex>
)

const Title = styled(Typography)`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
`

const ToggleIcon = styled(Icon)`
  transform: rotate(${({ isExpanded }) => (isExpanded ? 90 : -90)}deg);
  transition: transform 330ms ease-in-out;
`

MenuToggler.propTypes = {
  isExpanded: PropTypes.bool,
  toggleMenu: PropTypes.func
}

export default MenuToggler
