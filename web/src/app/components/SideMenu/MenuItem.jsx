import React from "react"
import PropTypes from "prop-types"
import { Link } from "@reach/router"
import styled from "styled-components"
import { Flex, Icon, Space, Typography } from "@kogaio"
import { themed, themeGet } from "@kogaio/utils"

const MenuItem = ({ item, isMenuExpanded, ...props }) => {
  const _handleLinkProps = ({ isPartiallyCurrent }) => {
    if (isPartiallyCurrent) return { id: "active-route" }
  }

  return (
    <MenuLink
      className='route-link'
      data-testid={`${item.id}-link`}
      getProps={_handleLinkProps}
      state={{ title: item.title }}
      title={item.title}
      to={item.route}
    >
      <Flex alignItems='center' {...props}>
        <Icon
          className='section-item-content item-icon'
          color='sidemenu-item'
          fontSize={2}
          name={item.iconName}
        />
        <Space ml={2}>
          <Typography
            as='span'
            className='section-item-content item-label'
            color='sidemenu-item'
            display={isMenuExpanded ? "block" : "hidden"}
            opacity={isMenuExpanded ? 1 : 0}
            variant='h6'
          >
            {item.title}
          </Typography>
        </Space>
      </Flex>
    </MenuLink>
  )
}

const MenuLink = styled(Link)`
  &#active-route .item-label:after {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: ${themeGet("colors.active")};
    border-radius: ${themeGet("radii.round")};
    margin-left: ${themeGet("space.2")}px;
  }

  .item-label {
    transition: opacity 330ms ease-in-out;
  }

  ${themed("MenuItem")};
`

MenuItem.propTypes = {
  isMenuExpanded: PropTypes.bool,
  item: PropTypes.object
}

export default MenuItem
