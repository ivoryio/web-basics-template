import React from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"

import { Flex, Space, Typography } from "@kogaio"
import { themeGet } from "@kogaio/utils"

const RadioButton = ({
  bulletSize,
  checked,
  error,
  id,
  label,
  onChange: handleChange,
  value,
  ...props
}) => (
  <Flex position='relative' width='fit-content' {...props}>
    <Input
      checked={checked}
      id={id}
      onChange={handleChange}
      type='radio'
      value={value}
    />
    <Space ml={2}>
      <RadioLabel
        as='label'
        checked={checked}
        error={error}
        htmlFor={id}
        bulletSize={bulletSize}
      >
        {label}
      </RadioLabel>
    </Space>
  </Flex>
)

const _labelStyle = ({ checked }) =>
  checked
    ? css`
        opacity: 1;
        transform: scale(1);
      `
    : css`
        opacity: 0;
        transform: scale(0);
      `

const _borderStyle = ({ checked, error }) =>
  checked
    ? css`
        border: ${themeGet("borders.2")} ${themeGet("colors.brand")};
      `
    : css`
        border: ${themeGet("borders.2")}
          ${themeGet(`colors.${error ? "error" : "brand25"}`)};
      `

const Input = styled.input`
  cursor: pointer;
  height: 100%;
  margin: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
  z-index: 1;
`

const RadioLabel = styled(Typography)`
  display: inline-block;
  height: auto;
  line-height: ${({ bulletSize }) => bulletSize}px;
  position: relative;
  padding-left: ${({ bulletSize }) => bulletSize + 8}px;
  width: auto;

  ::before {
    background-color: ${themeGet("colors.white")};
    border-radius: ${themeGet("radii.round")};
    content: "";
    height: ${({ bulletSize }) => bulletSize - 4}px;
    left: 0;
    position: absolute;
    top: 0;
    width: ${({ bulletSize }) => bulletSize - 4}px;
    ${_borderStyle};
  }

  ::after {
    background-color: ${themeGet("colors.brand")};
    border-radius: ${themeGet("radii.round")};
    content: "";
    height: ${({ bulletSize }) => bulletSize / 2}px;
    left: ${({ bulletSize }) => bulletSize / 4}px;
    position: absolute;
    top: ${({ bulletSize }) => bulletSize / 4}px;
    transition: all 0.2s ease;
    width: ${({ bulletSize }) => bulletSize / 2}px;
    ${_labelStyle};
  }
`

RadioButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  bulletSize: PropTypes.number,
  value: PropTypes.string
}

RadioButton.defaultProps = {
  bulletSize: 20
}

export default RadioButton
