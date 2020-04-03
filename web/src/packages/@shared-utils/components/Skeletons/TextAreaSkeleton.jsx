import React from 'react'
import { Box, Space } from '@kogaio'
import Skeleton from '../Skeleton'

export default () => (
  <Space mb={3}>
    <Box>
      <Space mt={1}>
        <Skeleton count={6} />
      </Space>
    </Box>
  </Space>
)
