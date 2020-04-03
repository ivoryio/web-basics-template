import React, { Children, cloneElement, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themed } from '@kogaio/utils'

const TabPanel = ({
  name,
  namespace,
  children,
  renderActiveTabPanelOnly,
  resetTabs,
  visible,
  ...passedProps
}) => {
  const canRenderChildren = useMemo(() => visible || renderActiveTabPanelOnly, [
    visible,
    renderActiveTabPanelOnly
  ])

  return (
    <Panel
      id={`tabpanel-${namespace}-${name}`}
      role='tabpanel'
      aria-labelledby={`tab-${namespace}-${name}`}
      style={visible ? styles.visible : styles.hidden}
      {...passedProps}>
      {canRenderChildren
        ? Children.toArray(children).map(child =>
            cloneElement(child, {
              resetTabs
            })
          )
        : null}
    </Panel>
  )
}

export const styles = {
  hidden: {
    display: 'none'
  },
  visible: {}
}

const Panel = styled.div`
  flex: 0 999 auto;
  min-width: 100%;

  ${themed('Tabs.Panel')};
`

TabPanel.propTypes = {
  children: PropTypes.node,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  namespace: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderActiveTabPanelOnly: PropTypes.bool,
  resetTabs: PropTypes.func,
  visible: PropTypes.bool
}

TabPanel.displayName = 'TabPanel'
export default TabPanel
