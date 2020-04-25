import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {

  launchAssessment,
  loadBasket,

} from 'features/mental/mentalSlice'

import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import AssignmentIcon from '@material-ui/icons/Assignment'

import { selectUser } from 'features/auth/authSlice'
import AssessmentsList from './AssessmentsList'

export default function AssignedAssessments() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
 

  const handleSelect = (e, id, marked) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(loadBasket(user.teacher, id, 'Evaluation'))
    .then(() => {
      dispatch(launchAssessment({ marked, assessmentId: id }))
    
    })
  }

  return (
    <Card>
      <CardHeader color='success' icon>
        <CardIcon color='success'>
          <AssignmentIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        <h3>Evaluations à faire </h3>
     
          <AssessmentsList type='Evaluation' onSelect={handleSelect} />
      
      </CardBody>
    </Card>
  )
}
