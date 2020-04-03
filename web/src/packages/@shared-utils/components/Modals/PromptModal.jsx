import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Button, Flex, Modal, Space, Typography } from "@kogaio"
import { themeGet } from "@kogaio/utils"

const PromptModal = ({
  containerStyle,
  destructive,
  disabled,
  headerTitle,
  hide,
  id,
  loading,
  prompt,
  submit,
  submitTitle,
  subtitle,
  title,
  visible
}) => (
  <Modal
    alignItems='center'
    animated
    id={
      id ||
      Math.random()
        .toString(36)
        .substring(7)
    }
    justifyContent='center'
    hide={hide}
    onBackdropClick={hide}
    visible={visible}
    withPortal
  >
    <Space p={16}>
      <Flex
        alignItems='center'
        bg='white'
        data-testid='prompt-card'
        flexDirection='column'
        justifyContent='center'
        {...containerStyle}
      >
        <HeaderTitle variant='titleLight'>{headerTitle}</HeaderTitle>
        <Space mt={headerTitle ? 5 : 0}>
          <Typography
            letterSpacing='tight'
            lineHeight='title'
            textAlign='center'
            variant='screenTitle'
          >
            {title}{" "}
            {subtitle ? (
              <Typography
                letterSpacing='tight'
                lineHeight='title'
                textAlign='center'
                variant='screenTitle'
              >
                {subtitle}
              </Typography>
            ) : null}
          </Typography>
        </Space>
        <Space mt={4}>
          <Flex>
            {prompt ? (
              <Button title={submitTitle} onClick={submit} variant='primary' />
            ) : (
              <Space mx={1}>
                <Button
                  data-testid='revoke-button'
                  disabled={disabled}
                  title='No, take me back'
                  onClick={hide}
                  variant={destructive ? "primary" : "outline"}
                />
                <Button
                  data-testid='confirm-button'
                  disabled={disabled}
                  loading={loading}
                  title={submitTitle}
                  onClick={submit}
                  variant={destructive ? "outline" : "primary"}
                />
              </Space>
            )}
          </Flex>
        </Space>
      </Flex>
    </Space>
  </Modal>
)

const HeaderTitle = styled(Typography)`
  color: ${themeGet("colors.black")};
`

PromptModal.propTypes = {
  containerStyle: PropTypes.object,
  destructive: PropTypes.bool,
  disabled: PropTypes.bool,
  headerTitle: PropTypes.string,
  hide: PropTypes.func.isRequired,
  id: PropTypes.string,
  loading: PropTypes.bool,
  prompt: PropTypes.bool,
  submit: PropTypes.func,
  submitTitle: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
}

PromptModal.defaultProps = {
  submitTitle: "Ok",
  title: "Are you sure you wish to continue?"
}

export default PromptModal
