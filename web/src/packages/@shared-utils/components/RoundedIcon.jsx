import React from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import { Flex, Icon } from "@kogaio"
import { themeGet } from "@kogaio/utils"

const RoundedIcon = ({ bg, disabled, fontSize, name, ...props }) => (
  <Wrapper bg={bg} disabled={disabled} bgSize={fontSize} {...props}>
    <Icon
      color={disabled ? "brand25" : "white"}
      fontSize={fontSize}
      name={name}
    />
  </Wrapper>
)
const bgSize = ({ bgSize = 0 }) => themeGet(`fontSizes.${bgSize}`, bgSize)

const backgroundSize = css`
  height: calc(${bgSize} + 0.125rem);
  min-width: calc(${bgSize} + 0.125rem);
`
const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ bg, disabled }) =>
    themeGet(`colors.${disabled ? "brand25" : bg}`)};
  border-radius: ${themeGet("radii.round")};
  justify-content: center;

  ${backgroundSize};
`

RoundedIcon.propTypes = {
  bg: PropTypes.string,
  disabled: PropTypes.bool,
  fontSize: PropTypes.number,
  name: PropTypes.string
}

RoundedIcon.defaultProps = {
  bg: "brand",
  fontSize: 0
}

export default RoundedIcon
