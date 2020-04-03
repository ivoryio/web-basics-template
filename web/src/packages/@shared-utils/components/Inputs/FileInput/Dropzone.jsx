import React from "react"
import PropTypes from "prop-types"
import { Flex, Modal, Space, Typography } from "@kogaio"
import Logo from "../../Logo"

const Dropzone = ({ logo: { color, height, width }, fontSize, visible }) => (
  <Modal
    animated
    backdropColor='modal-white90'
    border={1}
    borderStyle='dotted'
    position='absolute'
    top={0}
    left={0}
    visible={visible}
  >
    <Flex alignItems='center' bg='white' flexDirection='column'>
      <Logo color={color} height={height} width={width} />
      <Space mt={3}>
        <Typography bg='white' fontSize={fontSize} textAlign='center'>
          Drop file(s) in the dropzone...
        </Typography>
      </Space>
    </Flex>
  </Modal>
)

Dropzone.propTypes = {
  fontSize: PropTypes.number,
  logo: PropTypes.shape({
    color: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string
  }),
  visible: PropTypes.bool
}

Dropzone.defaultProps = {
  fontSize: 2,
  logo: {
    color: "brand",
    height: "30",
    width: "26"
  }
}

export default Dropzone
