import React, { useEffect } from 'react'
import { math } from 'tinycas/build/math/math'
import 'katex/dist/katex.min.css'
import List from 'react-bulma-components/lib/components/list'
import Level from 'react-bulma-components/lib/components/level'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import StaticMathfield from 'components/StaticMathfield'

function CorrectionItem({ question, number, answer, addPoint }) {
  const q = math(question.text)
  question = q.latex
  const empty = !answer.ASCIIMath
  const a = math(answer.ASCIIMath)
  const badExpression = a.type === '!! Error !!'

  
  const correct = !badExpression ? q.equals(a) : false
  const strictlyCorrect = !badExpression ? q.eval().string===answer.ASCIIMath : false

  let correction = q.latex+'='
  if (!correct &&!empty) {
    correction += '\\enclose{updiagonalstrike}[6px solid rgba(205, 0, 11, .4)]{'+answer.latex+'}\\text{  }'
  }
  
  if (badExpression || !correct) {
  correction += '\\color{green}'+q.eval().latex
  }
  if (correct) {
    correction += '\\color{green}'+answer.latex
    }

  
  if (correct && !strictlyCorrect) {
    correction +="\\color{black}\\text{ mais }\\color{green}"+q.eval().latex+"\\color{black}\\text{ c'est encore mieux !}" 
  }

  if (empty) {
    correction +="\\color{black}\\text{   (tu n'as rien répondu)}" 
  }

  const numStyle = {
    color: '#fff',
    display: 'inline-block',
    padding: '0.5em',
    marginRight: '1em',
    fontSize: '40px',
    background: '#02D1B2',
    width: '0.7em',
    height: '0.7em',
    boxSizing: 'initial',
    textAlign: 'center',
    borderRadius: '50%',
    lineHeight: '0.7em',
    // boxSizing:'contentBox'
  }

  useEffect(() => {if (correct) addPoint()},[addPoint, correct])

  return (
    <div style={{fontSize:40}}>
      <List.Item>
        <Level>
          <Level.Side align='left'>
            <Level.Item>
              <div style={numStyle}>{number}</div>
              <StaticMathfield text={correction}/>
              </Level.Item>
              <Level.Item>
              {correct && (
                <FontAwesomeIcon color='green' icon={faCheckCircle} />
              )}
              {!correct && <FontAwesomeIcon color='red' icon={faTimesCircle} />}
            </Level.Item>
          </Level.Side>
        </Level>
      </List.Item>
    </div>
  )
}

export default CorrectionItem
