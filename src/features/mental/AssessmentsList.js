import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadAssessmentsAsync } from 'features/mental/mentalSlice'
import { selectFetched, FETCH_ASSESSMENTS } from 'features/db/dbSlice'

import { CircularProgress, List, ListItem } from '@material-ui/core'

function AssessmentsList({ template, onSelect, onLoad, selected }) {
  const list = useSelector(selectFetched(FETCH_ASSESSMENTS))
  const dispatch = useDispatch()

  useEffect(() => dispatch(loadAssessmentsAsync(template)), [
    dispatch,
    template,
  ])

  if (!list) return <CircularProgress />

  if (onLoad) {
    onLoad(list.map(({ title }) => title))
  }

  return (
    <List hoverable>
      {list.map(({ title }, index) => (
        <ListItem
        selected={title === selected}
          key={index}
          button
          disableRipple
          onClick={() => {
            if (onSelect) {
              onSelect(title)
            }
          }}
        >
          {title}
        </ListItem>
      ))}
    </List>
  )
}

export default AssessmentsList
