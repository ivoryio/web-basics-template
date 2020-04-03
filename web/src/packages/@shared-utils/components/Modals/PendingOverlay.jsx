import React from "react"
import PropTypes from "prop-types"

import { ActivityIndicator, Flex, Modal, Space, Typography } from "@kogaio"

const PendingOverlay = ({ id, message, visible }) => (
  <Modal
    animated
    backdropColor='modal-white70'
    handleBackdropClick={() => {}}
    id='exporting-overlay'
    left={0}
    top={0}
    visible={visible}
  >
    <Flex alignItems='center' flexDirection='column' justifyContent='center'>
      <ActivityIndicator
        colors={{ background: "white", primary: "brand" }}
        size='32px'
      />
      <Space mt={4}>
        <Typography bg='white' variant='actionBtn'>
          {message}
        </Typography>
      </Space>
    </Flex>
  </Modal>
)

PendingOverlay.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  message: PropTypes.string.isRequired
}

PendingOverlay.defaultProps = {
  id: "exporting-overlay"
}

export default PendingOverlay
