import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Chip, Flex, IconButton, Space, Typography } from '@kogaio'
import { getFileExtension } from '../../../funcs'

const SelectedFileTag = ({ file, onDiscard: discardFile, ...props }) => {
  const chipName = useMemo(() => {
    const fileExtension = getFileExtension(file.name.toLowerCase())
    switch (fileExtension) {
      case 'doc':
      case 'docx':
        return 'DOCUMENT'
      case 'pdf':
        return 'PDF'
      default:
        return 'FILE'
    }
  }, [file.name])

  return (
    <Flex alignItems='center' {...props}>
      <Chip
        bg='alert'
        fontSize={0}
        fontFamily='primary'
        fontWeight='bold'
        isRounded
        label={chipName}
      />
      <Space ml={5} mr={2}>
        <Typography textStyle='underline' variant='paragraph' truncate>
          {file.name}
        </Typography>
      </Space>
      <IconButton
        color='gunmetal'
        effect='opacity'
        fontSize={3}
        name='delete_forever'
        onClick={() => discardFile(file)}
      />
    </Flex>
  )
}

SelectedFileTag.propTypes = {
  file: PropTypes.object,
  onDiscard: PropTypes.func
}

export default SelectedFileTag
