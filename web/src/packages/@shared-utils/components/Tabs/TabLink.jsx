import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { themed } from "@kogaio/utils"
import { Flex } from "@kogaio/Responsive"

const TabLink = ({
  children,
  className,
  component,
  disabled,
  handleSelect,
  isActive,
  namespace,
  onClick,
  title,
  to,
  visible,
  ...passedProps
}) => {
  if (!visible) return null
  const handleClick = ev => {
    if (typeof handleSelect === "function") handleSelect(to, namespace)

    if (typeof onClick === "function") onClick(ev)
  }

  const handleKeyPress = ev => {
    if (ev.key === " " || ev.key === "Enter") {
      ev.preventDefault()
      handleClick(ev)
    }
  }

  return (
    <Link
      aria-selected={!!isActive}
      aria-controls={`tabpanel-${namespace}-${to}`}
      as={component}
      className='route-link'
      disabled={disabled}
      onKeyPress={handleKeyPress}
      onClick={handleClick}
      role='tab'
      title={title}
      {...passedProps}
    >
      {title ?? children}
    </Link>
  )
}

const Link = styled(Flex)`
  appearance: none;
  border: none;

  :active,
  :focus,
  :hover {
    outline: none;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  }

  ${themed("Tabs.Link")};
`

TabLink.propTypes = {
  activeStyle: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.oneOf(["a", "button"]).isRequired,
  default: PropTypes.bool,
  disabled: PropTypes.bool,
  handleSelect: PropTypes.func,
  isActive: PropTypes.bool,
  namespace: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  title: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  visible: PropTypes.bool
}

TabLink.defaultProps = {
  component: "button",
  visible: true
}

TabLink.displayName = "TabLink"
export default TabLink
