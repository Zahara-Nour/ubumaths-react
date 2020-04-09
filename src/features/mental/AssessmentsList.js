import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectFetched,
  selectDataFetched,
  loadAssessmentsThunk,
} from 'features/mental/mentalSlice'
import Box from 'react-bulma-components/lib/components/box/box'
import List from 'react-bulma-components/lib/components/list'
import Loader from 'react-bulma-components/lib/components/loader'

function AssessmentsList({ template, clickCB, loadCB }) {
  const fetched = useSelector(selectFetched)
  const dispatch = useDispatch()
  const list = useSelector(selectDataFetched)
  useEffect(() => dispatch(loadAssessmentsThunk(template)), [
    dispatch,
    template,
  ])

  if (!fetched)
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

  loadCB(list.map(({ title }) => title))

  return (
    <Box>
      <List hoverable>
        {list.map(({ title }, index) => (
          <List.Item key={index} onClick={() => clickCB(title)}>
            {title}
          </List.Item>
        ))}
      </List>
    </Box>
  )
}

export default AssessmentsList
