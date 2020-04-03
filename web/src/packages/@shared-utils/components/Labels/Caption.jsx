import React from "react"
import PropTypes from "prop-types"

import { Typography } from "@kogaio"

const Caption = ({ children, ...props }) =>
  children ? (
    <Typography
      color='brand'
      fontFamily='complementary'
      fontWeight='lighter'
      variant='h6'
      {...props}
    >
      {children}
    </Typography>
  ) : null

Caption.propTypes = {
  children: PropTypes.node
}

export default Caption
