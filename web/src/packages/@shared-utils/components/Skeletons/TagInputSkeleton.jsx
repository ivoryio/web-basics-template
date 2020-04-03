import React from 'react'
import { Box, Space } from '@kogaio'
import Skeleton from '../Skeleton'

export default () => {
  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  return (
    <Box>
      <Space mb={1} mr={2}>
        <Skeleton
          borderRadius={16}
          count={getRandomInt(0, 3)}
          height={24}
          width={getRandomInt(70, 120)}
        />
      </Space>
    </Box>
  )
}
