import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  
  loadAssessmentsThunk,

} from 'features/mental/mentalSlice'
import {
  selectFetched,

  FETCH_ASSESSMENTS,
} from 'features/db/dbSlice'

import Box from 'react-bulma-components/lib/components/box/box'
import List from 'react-bulma-components/lib/components/list'
import Loader from 'react-bulma-components/lib/components/loader'

function AssessmentsList({ template, clickCB, loadCB }) {
  const list = useSelector(selectFetched(FETCH_ASSESSMENTS))
  const dispatch = useDispatch()
  
  useEffect(() => dispatch(loadAssessmentsThunk(template)), [
    dispatch,
    template,
  ])

  if (!list)
    return (
      <Loader
        style={{
          width: 50,
          height: 50,
          border: '4px solid blue',
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
        }}
      />
    )

  if (loadCB) {
    loadCB(list.map(({ title }) => title))
  }

  return (
    <Box>
      <List hoverable>
        {list.map(({ title }, index) => (
          <List.Item
            key={index}
            onClick={() => {
              if (clickCB) {
                clickCB(title)
              }
            }}
          >
            {title}
          </List.Item>
        ))}
      </List>
    </Box>
  )
}

export default AssessmentsList
