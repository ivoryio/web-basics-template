import React, { Children, cloneElement, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themed } from '@kogaio/utils'
import { Flex } from '@kogaio/Responsive'

import { usePrevious } from '../../hooks/usePrevious'

import TabLink from './TabLink'
import TabPanel from './TabPanel'

const findDefaultTab = children => {
  let firstLink
  let firstDefaultLink

  const traverse = child => {
    if (!child || !child.props || firstDefaultLink) return

    if (child.type.displayName === 'TabLink') {
      firstLink = firstLink ?? child.props.to
      firstDefaultLink =
        firstDefaultLink ?? (child.props.default && child.props.to)
    }

    Children.forEach(child.props.children, traverse)
  }

  Children.forEach(children, traverse)

  return firstDefaultLink ?? firstLink
}

const Tabs = ({
  children,
  onChange,
  name,
  renderActiveTabContentOnly,
  selectedTab,
  tabComponent,
  ...panelProps
}) => {
  const [currentTab, setCurrentTab] = useState(
    selectedTab ?? findDefaultTab(children)
  )

  const tabNamespace = name ?? `ns-${Math.floor(100000 * Math.random())}`
  const prevTab = usePrevious(currentTab)
  const prevSelected = usePrevious(selectedTab)

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(currentTab, tabNamespace)
      if (currentTab !== prevTab) onChange(currentTab, tabNamespace)
      if (selectedTab !== prevSelected) setCurrentTab(selectedTab)
    }
  }, [currentTab, onChange, prevSelected, prevTab, selectedTab, tabNamespace])

  const resetTabs = tabName => {
    const initialTab = tabName ?? selectedTab
    setCurrentTab(initialTab ?? findDefaultTab(children))
  }

  const transformChildren = (
    children,
    { handleSelect, selectedTab, name, tabComponent }
  ) => {
    if (typeof children !== 'object') return children

    return Children.map(children, child => {
      if (!child) return child

      if (child.type.displayName === 'TabLink') {
        return cloneElement(child, {
          isActive: child.props.to === selectedTab,
          component: child.props.component || tabComponent,
          handleSelect,
          namespace: name
        })
      }

      if (child.type.displayName === 'TabPanel') {
        return cloneElement(child, {
          namespace: name,
          renderActiveTabContentOnly,
          resetTabs,
          visible: child.props.name === selectedTab
        })
      }

      return cloneElement(
        child,
        {},
        transformChildren(child.props && child.props.children, {
          handleSelect,
          selectedTab,
          name,
          tabComponent
        })
      )
    })
  }

  const onSelect = (tab, namespace) => setCurrentTab(tab)

  const tabChildren = transformChildren(children, {
    handleSelect: onSelect,
    name: tabNamespace,
    selectedTab: currentTab,
    tabComponent
  })

  return <TabLinkWrapper {...panelProps}>{tabChildren}</TabLinkWrapper>
}

const TabLinkWrapper = styled(Flex)`
  align-content: flex-start;
  flex-wrap: wrap;
  ${themed('Tabs')};
`

Tabs.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  renderActiveTabContentOnly: PropTypes.bool,
  selectedTab: PropTypes.string,
  tabComponent: PropTypes.string
}

Tabs.Link = TabLink
Tabs.Panel = TabPanel

export default Tabs
