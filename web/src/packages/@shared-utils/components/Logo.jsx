import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { themeGet } from "@kogaio/utils"

const logoVariants = ["short", "full", "full_material"]
const Logo = ({ color, height, variant, width, ...props }) => {
  switch (variant) {
    case "short":
      return (
        <LogoShort color={color} height={height} width={width} {...props} />
      )
    case "full":
      return (
        <LogoFullDefault
          color={color}
          height={height}
          width={width}
          {...props}
        />
      )
    case "full_material":
      return <LogoFullMaterial height={height} width={width} {...props} />
    default:
      console.error(
        `* Invalid logo size provided. Expected one of ${logoVariants}.`
      )
      return null
  }
}

const LogoShort = ({ color, height, width, ...props }) => (
  <Icon
    className='starterkit-logo-short'
    fill={color}
    height={height}
    viewBox='0 0 26 30'
    width={width}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      className='starterkit-logo-short-light'
      d='M12.9204 8.73614Z'
      fill={color}
    />
  </Icon>
)
const LogoFullDefault = ({ color, height, width, ...props }) => (
  <Icon
    className='starterkit-logo-extended'
    fill={color}
    height={height}
    width={width}
    viewBox='0 0 63 30'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <g clipPath='url(#clip0)'>
      <path
        className='starterkit-logo-full-light'
        d='M12.9204 0L0 7.50028V22.4997L12.9204 30L25.8397 22.4997V7.50028L12.9204 0ZM4.88816 7.0616L6.72395 8.08883L4.02159 9.76062V22.3433L2.14594 21.2545L2.1858 8.72131L4.88816 7.0616ZM6.09491 10.935L8.79726 9.24673L10.6472 10.2811L7.94489 11.9809V24.6212L6.09491 23.5473V10.935ZM7.09089 5.87405L9.01186 4.75953L19.7443 11.0102V14.2665L17.891 15.3426V12.0781L7.09089 5.87405ZM10.0439 13.1701L12.9193 11.5878L15.7964 13.2997V16.5576L12.9188 18.2272L10.0439 16.5625V13.1701ZM10.0439 23.7043L12.0353 24.8479L12.8882 25.3322L12.9204 25.3503L23.6938 19.1023V21.2545L12.9259 27.5058L12.9204 27.5091L10.0439 25.8395V23.7043ZM12.9204 20.7176L23.6938 14.4631V16.6108L12.9199 22.8687L10.0444 21.2205V19.0513L12.9204 20.7176ZM23.6938 8.73614V11.9749L21.8405 13.0499V9.80345L11.113 3.54068L12.9204 2.49094L23.6938 8.73614Z'
        fill={color}
      />
    </g>
  </Icon>
)

const LogoFullMaterial = ({ height, width, ...props }) => (
  <Icon
    {...props}
    fill='none'
    height={height}
    viewBox='0 0 94 44'
    width={width}
    xmlns='http://www.w3.org/2000/svg'
  >
    <g>
      <path
        d='M38.5537 11.0004L19.2781 0L0 11.0004V32.9996L19.2781 44L38.5545 32.9996V11.0004H38.5537ZM14.9861 24.2925V19.3169L19.2765 16.9962L23.5693 19.507V24.2853L19.2756 26.734L14.9861 24.2925Z'
        fill='#7CAADD'
      />
      <path
        d='M19.2781 0L0 11.0004V32.9996L19.2781 44L38.5545 32.9996V11.0004L19.2781 0ZM7.29344 10.357L10.0326 11.8636L6.00047 14.3156V32.7701L3.20188 31.1733L3.26135 12.7913L7.29344 10.357ZM9.09399 16.038L13.1261 13.5619L15.8864 15.0789L11.8543 17.572V36.111L9.09399 34.536V16.038ZM10.5801 8.61528L13.4463 6.98064L29.4597 16.1483V20.9242L26.6945 22.5025V17.7145L10.5801 8.61528ZM14.9861 19.3161L19.2765 16.9954L23.5693 19.5062V24.2845L19.2756 26.7332L14.9861 24.2917V19.3161ZM14.9861 34.7663L17.9574 36.4436L19.23 37.1538L19.2781 37.1804L35.3527 28.0168V31.1733L19.2862 40.3418L19.2781 40.3466L14.9861 37.8979V34.7663ZM19.2781 30.3858L35.3527 21.2125V24.3626L19.2773 33.5407L14.9869 31.1234V27.9419L19.2781 30.3858ZM35.3527 12.813V17.5631L32.5875 19.1398V14.3784L16.5813 5.193L19.2781 3.65338L35.3527 12.813Z'
        fill='#3B2552'
      />
    </g>
  </Icon>
)

const Icon = styled.svg`
  fill: ${({ fill }) => themeGet(`colors.${fill}`, fill)};
`

const logoProps = {
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}
Logo.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  variant: PropTypes.oneOf(logoVariants)
}
Logo.defaultProps = {
  variant: "short"
}

LogoShort.propTypes = logoProps
LogoFullDefault.propTypes = logoProps
LogoFullMaterial.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string
}

LogoShort.defaultProps = {
  color: "#947B95",
  height: "30",
  width: "26"
}
LogoFullDefault.defaultProps = {
  color: "#947B95",
  height: "30",
  width: "63"
}
LogoFullMaterial.defaultProps = {
  height: "44",
  width: "94"
}

export default Logo
