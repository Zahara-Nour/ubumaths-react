import React, { useEffect } from 'react'
import { math } from 'tinycas/build/math/math'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import MathField from 'react-mathfield'
import { ListItem } from '@material-ui/core'
import QuestionNumber from './QuestionNumber'


function CorrectionItem({ question, number, answer, addPoint }) {
  console.log('question.text',question.text)
  const q = math(question.text)
  question = q.latex
  const empty = !answer.ASCIIMath
  const a = math(answer.ASCIIMath)
  const badExpression = a.type === '!! Error !!'

  const correct = !badExpression ? q.equals(a) : false
  const strictlyCorrect = !badExpression
    ? q.eval().string === answer.ASCIIMath
    : false

  let correction = q.latex + '='
  if (!correct && !empty) {
    correction +=
      '\\enclose{updiagonalstrike}[6px solid rgba(205, 0, 11, .4)]{' +
      answer.latex +
      '}\\text{  }'
  }

  if (badExpression || !correct) {
    correction += '\\color{green}' + q.eval().latex
  }
  if (correct) {
    correction += '\\color{green}' + answer.latex
  }

  if (correct && !strictlyCorrect) {
    correction +=
      '\\color{black}\\text{ mais }\\color{green}' +
      q.eval().latex +
      "\\color{black}\\text{ c'est encore mieux !}"
  }

  if (empty) {
    correction += "\\color{black}\\text{   (tu n'as rien répondu)}"
  }

  useEffect(() => {
    if (correct) addPoint()
  }, [addPoint, correct])

  return (
    <div style={{ fontSize: 40 }}>
      <ListItem>
        <QuestionNumber number={number} fontSize={40} />
        <MathField latex={correction} />

        {correct && <FontAwesomeIcon color='green' icon={faCheckCircle} style={{marginLeft:'1em', marginRight:'1em'}}/>}
        {!correct && <FontAwesomeIcon color='red' icon={faTimesCircle} style={{marginLeft:'1em', marginRight:'1em'}}/>}
      </ListItem>
    </div>
  )
}

export default CorrectionItem
