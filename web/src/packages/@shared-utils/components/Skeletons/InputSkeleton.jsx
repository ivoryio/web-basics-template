import React from 'react'
import PropTypes from 'prop-types'

import { Box, Space } from '@kogaio'
import Skeleton from '../Skeleton'

const InputSkeleton = ({ width }) => (
  <Box height='40px'>
    <Space my={2}>
      <Skeleton width={width} />
    </Space>
  </Box>
)

InputSkeleton.propTypes = {
  width: PropTypes.number
}

InputSkeleton.defaultProps = {
  width: 2 / 3
}

export default InputSkeleton
