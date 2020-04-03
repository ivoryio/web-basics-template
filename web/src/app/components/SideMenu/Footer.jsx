import React from "react"
import PropTypes from "prop-types"
import { Box, Space } from "@kogaio"
import MenuToggler from "./MenuToggler"

const Footer = ({ sidemenu, ...props }) => (
  <Box
    bg='brand'
    flexDirection='column'
    position='sticky'
    top='100%'
    width={1}
    {...props}
  >
    <Space mt={2} px={6} py={3}>
      <MenuToggler
        isExpanded={sidemenu.isExpanded}
        toggleMenu={sidemenu.toggle}
      />
    </Space>
  </Box>
)

Footer.propTypes = {
  sidemenu: PropTypes.shape({
    isExpanded: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
  })
}

export default Footer
