import React from "react"
import PropTypes from "prop-types"
import { Modal, ActivityIndicator } from "@kogaio"

const Overlay = ({
  backdropColor,
  children,
  "data-testid": dataTestId,
  id,
  visible,
  ...props
}) => {
  const modalId =
    id ??
    `modal-${Math.random()
      .toString(36)
      .substring(7)}`

  return (
    <Modal
      backdropColor={backdropColor}
      bottom={0}
      data-testid={dataTestId}
      id={modalId}
      left={0}
      position='absolute'
      right={0}
      top={0}
      handleBackdropClick={() => false}
      visible={visible}
      {...props}
    >
      <ActivityIndicator
        colors={{ background: "transparent", primary: "brand" }}
        position='absolute'
        top={0}
        variant='runningbar'
      />
      {children}
    </Modal>
  )
}

Overlay.propTypes = {
  backdropColor: PropTypes.string,
  children: PropTypes.node,
  "data-testid": PropTypes.string,
  id: PropTypes.string,
  visible: PropTypes.bool.isRequired
}

Overlay.defaultProps = {
  backdropColor: "modal-white70"
}

export default Overlay
