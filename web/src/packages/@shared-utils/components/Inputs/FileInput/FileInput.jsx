import React, { useRef } from "react"
import PropTypes from "prop-types"
import { Box, Button, Flex, Space, Typography } from "@kogaio"
import styled from "styled-components"

import Dropzone from "./Dropzone"
import { Sublabel } from "../../Labels"
import SelectedFileTag from "./SelectedFileTag"

import { useDropzone } from "./useDropzone"

const FileInput = ({
  accept,
  buttonLabel,
  disabled,
  error,
  id,
  label,
  multiple,
  name,
  noBottomSpace,
  onChange: handleChange,
  required,
  sublabel,
  value,
  ...props
}) => {
  const _selectFiles = files => {
    const { length, ...items } = files

    if (length === 1 || !multiple) return handleChange(items[0])
    return handleChange(items)
  }

  const dropzoneRef = useRef()
  const { dragging } = useDropzone(_selectFiles, dropzoneRef)

  const _handleFileChange = ev => _selectFiles(ev.currentTarget.files)

  const _handleDiscardFiles = targetFile => {
    if (!multiple) return handleChange(null)

    const filteredFiles = {
      ...Object.values(value).filter(
        selected => selected.name !== targetFile.name
      )
    }

    const selectedFilesLength = Object.values(filteredFiles).length
    switch (selectedFilesLength) {
      case 0:
        handleChange(null)
        break
      case 1:
        handleChange(filteredFiles[0])
        break
      default:
        handleChange(filteredFiles)
        break
    }
  }

  return (
    <Box position='relative' ref={dropzoneRef} {...props}>
      <Dropzone fontSize={1} visible={dragging} />
      {label ? (
        <Typography
          as='label'
          className='fileinput-label'
          display='block'
          htmlFor={id}
          variant='inputLabel'
        >
          {label} {required ? "*" : null}
        </Typography>
      ) : null}
      {value == null ||
      !(value instanceof File || Object.keys(value).length > 0) ? (
        <Flex position='relative' width='fit-content'>
          <Input
            accept={accept}
            defaultValue={value}
            disabled={disabled}
            id={id}
            multiple={multiple}
            name={name}
            onChange={_handleFileChange}
            required={required}
            type='file'
          />
          <Button
            as='label'
            bg={error ? "error03" : "transparent"}
            borderColor={error ? "error" : "brand"}
            htmlFor={id}
            title={buttonLabel}
            variant='outline'
          />
        </Flex>
      ) : (
        <Space mt={2}>
          {Object.values(value).length > 1 ? (
            Object.values(value).map(file => (
              <SelectedFileTag
                file={file}
                key={file.name}
                onDiscard={_handleDiscardFiles}
              />
            ))
          ) : (
            <SelectedFileTag file={value} onDiscard={_handleDiscardFiles} />
          )}
          {sublabel ? <Sublabel color='info'>{sublabel}</Sublabel> : null}
        </Space>
      )}
      {typeof error === "string" && error.length > 0 ? (
        <Space my={1}>
          <Sublabel
            align='flex-start'
            className='textarea-sublabel'
            type={error ? "error" : "valid"}
          >
            {error}
          </Sublabel>
        </Space>
      ) : (
        <Dummy hide={noBottomSpace} />
      )}
    </Box>
  )
}

const Input = styled.input`
  &[type="file"] {
    cursor: pointer;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
`

const Dummy = styled.div`
  display: ${({ hide }) => (hide ? "none" : "block")};
  height: 20px;
  opacity: 0;
  visibility: hidden;
`

FileInput.propTypes = {
  accept: PropTypes.string,
  buttonLabel: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  id: PropTypes.string,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  noBottomSpace: PropTypes.bool,
  /**
   * @param {Object} files selected files
   */
  onChange: PropTypes.func,
  required: PropTypes.bool,
  sublabel: PropTypes.string,
  /**
   * @param {Object} file default/active value
   */
  value: PropTypes.object
}

FileInput.defaultProps = {
  buttonLabel: "UPLOAD",
  multiple: false,
  onChange: () => console.warn("* FileInput expects an onChange function")
}

export default FileInput
