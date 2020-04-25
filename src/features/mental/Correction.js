import React, { useState, useCallback, useEffect } from 'react'
import CorrectionItem from './CorrectionItem'
import max from 'assets/img/max.svg'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectAnswers,
  selectMarked,
  selectAssessmentId,
  saveMarkAsync,
  correctionFinished,
} from './mentalSlice'
import { selectUser } from 'features/auth/authSlice'
import { List, ListItem, Divider } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

export default function Correction({ questions }) {
  const answers = useSelector(selectAnswers)
  const [score, setScore] = useState(0)
  const fontSize = 20
  const marked = useSelector(selectMarked)
  const dispatch = useDispatch()
  const userId = useSelector(selectUser).email
  const assessmentId = useSelector(selectAssessmentId)

  const handleAddPoint = useCallback(() => setScore((s) => s + 1), [setScore])
  const history = useHistory()

  useEffect(() => {
    if (marked) dispatch(saveMarkAsync(userId, assessmentId, score))
  })

  const flexContainerColumn = {
    display: 'flex',
    flexDirection: 'column',
  }

  const flexContainerRow = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
  return (
    //  <img src={max} alt='Max' />
    <>
      <h1>Correction</h1>
      <button onClick={() => dispatch(correctionFinished())}>Retour au calcul mental</button>
      <Divider />
      Score :{score} sur {questions.length}
      <List style={flexContainerColumn}>
        {questions.map((question, index) => (
          <CorrectionItem
            key={index}
            question={question}
            answer={answers[index]}
            number={index + 1}
            addPoint={handleAddPoint}
          />
        ))}
      </List>
    </>
  )
}
