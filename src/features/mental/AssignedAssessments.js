import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  loadAssignedAssessmentsThunk,
  launchAssessment,
  loadBasketThunk,
  selectRawQuestions,
} from 'features/mental/mentalSlice'
import {
  selectFetched,
  FETCH_ASSIGNED_ASSESSMENTS,
} from 'features/db/dbSlice'

import Box from 'react-bulma-components/lib/components/box/box'
import List from 'react-bulma-components/lib/components/list'
import Loader from 'react-bulma-components/lib/components/loader'
import Heading from 'react-bulma-components/lib/components/heading'
import Level from 'react-bulma-components/lib/components/level'
import Button from 'react-bulma-components/lib/components/button'

export default function AssignedAssessments({ userId }) {
  const list = useSelector(selectFetched(FETCH_ASSIGNED_ASSESSMENTS))
  const dispatch = useDispatch()
  const [selectedAssessment, setSelectedAssessment] = useState(0)

  useEffect(() => dispatch(loadAssignedAssessmentsThunk({ userId })), [
    dispatch,
    userId,
  ])

  const questions = useSelector(selectRawQuestions)
  console.log('questions')
  console.log(questions)

  const handleClickLaunch = (index) => {
    dispatch(loadBasketThunk({ id: list[index].id }))
    setSelectedAssessment(index)
  }

  const handleClickTrain = (index) => {}
  if (questions.length > 0) {
    dispatch(launchAssessment())
  }

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
    

  return (
    <Box>
      <Heading size={4}>Evaluations à faire </Heading>
      <List hoverable>
        {list.map(({ title }, index) => (
          <List.Item key={index}>
            <Level>
              <Level.Side align='left'>
                <Level.Item>{title}</Level.Item>
              </Level.Side>
              <Level.Side align='right'>
                <Level.Item>
                  <Button color='link' onClick={() => handleClickTrain(index)}>
                    S'entraîner
                  </Button>
                </Level.Item>
                <Level.Item>
                  <Button color='link' onClick={() => handleClickLaunch(index)}>
                    Faire
                  </Button>
                </Level.Item>
              </Level.Side>
            </Level>
          </List.Item>
        ))}
      </List>
    </Box>
  )
}
