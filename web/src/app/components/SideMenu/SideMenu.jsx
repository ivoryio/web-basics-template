import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from '@reach/router'
import styled from 'styled-components'
import { themed, themeGet } from '@kogaio/utils'
import { Flex, Space, Typography } from '@kogaio'

import { Logo } from '@shared-utils/components'
import { useFeatureFlags } from '@shared-utils/hooks/useFeatureFlags'
import { sideMenuItems } from 'app/constants/sidemenu'

import Footer from './Footer'
import MenuItem from './MenuItem'
import { useSideMenu } from './useSideMenu'

const SideMenu = ({ user, ...props }) => {
  const sidemenu = useSideMenu({ initialExpanded: true })
  const featureFlags = useFeatureFlags()

  const _renderItems = useCallback(
    section => {
      const { isExpanded } = sidemenu
      const { flags, permission } = section
      const isAllowedToAccess =
        !permission ||
        permission.some(permission => user?.roles.includes(permission) ?? false)

      const itemIsVisible = flags
        ? Object.keys(flags).some(flag => flags[flag] === featureFlags?.[flag])
        : true

      if (!isAllowedToAccess || !itemIsVisible) return null

      return <MenuItem item={section} isMenuExpanded={isExpanded} />
    },
    [featureFlags, sidemenu, user]
  )

  const { isExpanded, width } = sidemenu

  return (
    <Container
      as='nav'
      className={`sidemenu-${isExpanded ? 'expanded' : 'collapsed'}`}
      data-testid='sidemenu-navigator'
      flexDirection='column'
      height='100%'
      id='starterkit-sidemenu'
      width={width}
      {...props}>
      <Flex flexDirection='column' height='100%' position='relative' width={1}>
        <Space my={4} px={5}>
          <Flex
            alignItems='center'
            justifyContent='space-between'
            position='relative'>
            <Link className='route-link' id='escape-route' to='/programs'>
              <Logo title='Home' variant={isExpanded ? 'full' : 'short'} />
            </Link>
          </Flex>
        </Space>
        <ItemsWrapper>
          {sideMenuItems.map(item =>
            item.type === 'section-title' ? (
              <Space key={item.id} pl={3} py={3}>
                <SectionTitle isVisible={isExpanded} item={item} />
              </Space>
            ) : (
              <Space key={item.id} px={6} py={3}>
                {_renderItems(item)}
              </Space>
            )
          )}
        </ItemsWrapper>
        <Space pt={2}>
          <Footer sidemenu={sidemenu} />
        </Space>
      </Flex>
    </Container>
  )
}

const Container = styled(Flex)`
  overflow: hidden;

  ${themed('SideMenu')};
`

const SectionTitle = ({ isVisible, item, ...props }) => (
  <Title isVisible={isVisible} variant='menuSectionTitle' {...props}>
    {item.title}
  </Title>
)

const Title = styled(Typography)`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};

  transition: opacity 330ms ease-in-out;
`

const ItemsWrapper = styled(Flex)`
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${themeGet('colors.sidemenu-item')};
    border-radius: ${themeGet('radii.8')}px;
  }
`

SectionTitle.propTypes = {
  isVisible: PropTypes.bool,
  item: PropTypes.object
}

SideMenu.propTypes = {
  user: PropTypes.object
}

export default SideMenu
