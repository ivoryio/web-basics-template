import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Flex, Icon, Modal, Space, Typography } from '@kogaio'

const ConfirmationModal = ({
  confirmMessage,
  hide,
  subtitle,
  title,
  visible,
  ...props
}) => (
  <Modal animated visible={visible} {...props}>
    <Space px={12} py={10}>
      <Card
        alignItems='center'
        display='flex'
        flexDirection='column'
        variant='white'>
        <Typography color='black' role='title' variant='titleLight'>
          {title}
        </Typography>
        <Space mt={4}>
          <Flex>
            <Icon color='active' fontSize={3} name='check_circle' />
            <Space ml={1}>
              <Typography color='active' fontSize={1}>
                {confirmMessage}
              </Typography>
            </Space>
          </Flex>
          <Space mt={3}>
            <Typography color='header-message' fontSize={1}>
              {subtitle}
            </Typography>
          </Space>
          <Space mt={4}>
            <Button onClick={hide} title='Thanks!' />
          </Space>
        </Space>
      </Card>
    </Space>
  </Modal>
)

ConfirmationModal.propTypes = {
  confirmMessage: PropTypes.string,
  hide: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  visible: PropTypes.bool
}

ConfirmationModal.defaultProps = {
  confirmMessage: 'Your request has been succesfully sent!',
  title: 'Success!'
}

export default ConfirmationModal
