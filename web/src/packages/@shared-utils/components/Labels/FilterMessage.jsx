import React from 'react'
import PropTypes from 'prop-types'
import { Space, Typography } from '@kogaio'

const FilterMessage = ({ filterName, filterSuffix }) => (
  <Space mx='auto' mt={6}>
    <Typography display='flex' textAlign='center' variant='subtitle'>
      No results found for&nbsp;
      <Space mx={1}>
        <Typography color='brand' fontWeight='bold'>
          {filterName}
        </Typography>
      </Space>
      &nbsp;{filterSuffix}
    </Typography>
  </Space>
)

FilterMessage.propTypes = {
  filterName: PropTypes.string,
  filterSuffix: PropTypes.string
}

FilterMessage.defaultProps = {
  filterSuffix: 'category'
}

export default FilterMessage
