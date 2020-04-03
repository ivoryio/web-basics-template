import React from "react"
import { navigate } from "@reach/router"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Button, Flex, Modal, Space, Typography } from "@kogaio"
import { themeGet } from "@kogaio/utils"

const BlurOverlay = ({ children, cover, id, title, visible, ...props }) => {
  const modalId =
    id ||
    `modal-${Math.random()
      .toString(36)
      .substring(7)}`

  return (
    <BlurredModal
      backdropColor='transparent'
      handleBackdropClick={() => {}}
      id={modalId}
      overlayStyle={{
        border: 1,
        borderTop: 0,
        borderColor: "modal-border",
        bottom: 0,
        height: "auto",
        mt: cover !== "full" ? "20%" : 0,
        zIndex: 10
      }}
      position='absolute'
      visible={visible}
      {...props}
    >
      {children ?? (
        <Flex
          alignItems='center'
          flexDirection='column'
          justifyContent='center'
        >
          <Typography>{title}</Typography>
          <Space mt={4}>
            <Button onClick={() => navigate("/billing")} title='Upgrade now' />
          </Space>
        </Flex>
      )}
    </BlurredModal>
  )
}

const BlurredModal = styled(Modal)`
  background: linear-gradient(
    180deg,
    ${themeGet("colors.modal-white90")} 0%,
    ${themeGet("colors.white")} 100%
  );
`

BlurOverlay.propTypes = {
  children: PropTypes.node,
  cover: PropTypes.oneOf(["full", "partial"]),
  id: PropTypes.string,
  title: PropTypes.string,
  visible: PropTypes.bool.isRequired
}

BlurOverlay.defaultProps = {
  cover: "partial"
}

export default BlurOverlay
