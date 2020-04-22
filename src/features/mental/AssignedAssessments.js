import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  loadAssignedAssessmentsAsync,
  launchAssessment,
  loadBasketAsync,
  selectRawQuestions,
} from 'features/mental/mentalSlice'
import { selectFetched, FETCH_ASSIGNED_ASSESSMENTS } from 'features/db/dbSlice'
import { CircularProgress, List, ListItem } from '@material-ui/core'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import Button from 'components/CustomButtons/Button'
import AssignmentIcon from '@material-ui/icons/Assignment';
import  {grayColor} from 'assets/jss/main-jss'

const listItemAssessmentStyle = {
  marginLeft:'10px',
  marginRight:'10px'
}

export default function AssignedAssessments({ userId }) {
  const list = useSelector(selectFetched(FETCH_ASSIGNED_ASSESSMENTS))
  const dispatch = useDispatch()
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const questions = useSelector(selectRawQuestions)
  const [marked, setMarked] = useState(false)

  useEffect(() => dispatch(loadAssignedAssessmentsAsync({ userId })), [
    dispatch,
    userId,
  ])

  useEffect(() => {
    if (selectedAssessment !== null && questions.length > 0) {

      dispatch(
        launchAssessment({ marked, assessmentId: list[selectedAssessment].id }),
      )
    }
  })

  const handleClickLaunch = (index) => {
    dispatch(loadBasketAsync(list[index].id))
    setSelectedAssessment(index)
    setMarked(true)
  }

  const handleClickTrain = (index) => {
    dispatch(loadBasketAsync(list[index].id))
    setSelectedAssessment(index)
    setMarked(false)
  }

  if (!list) return <CircularProgress />

  return (
    <Card>
      <CardHeader color='success' icon>
        <CardIcon color='success'>
          <AssignmentIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
      <h3>Evaluations à faire </h3>
      <List>
        {list.map(({ title }, index) => (
          <ListItem key={index}>
        
                <h4 style={listItemAssessmentStyle}>{title}</h4>
           
                  <Button style={{...listItemAssessmentStyle, backgroundColor:grayColor[3]}} size='sm'  onClick={() => handleClickTrain(index)}>
                    S'entraîner
                  </Button>
           
                  <Button style={listItemAssessmentStyle} size='sm' color='danger' onClick={() => handleClickLaunch(index)}>
                    Faire
                  </Button>
              
          </ListItem>
        ))}
      </List>
      </CardBody>
    </Card>
    
     
   
  )
}
