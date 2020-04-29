import React, { useState, useEffect, useRef } from 'react'
import Question from './Question'

import { assessmentFinished } from './mentalSlice'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont } from '@fortawesome/free-solid-svg-icons'
import MathField from 'react-mathfield'
import math from 'tinycas'
import { useInterval } from 'app/hooks'
import './mental.css'
import { Button } from '@material-ui/core'
import CircularProgressBar from 'components/CircularProgressBar'

function Questions({ questions }) {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const [start, setStart] = useState(Date.now())
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [hasToChange, setHasToChange] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const answersRef = useRef([])
  const [delay, setDelay] = useState()
  const [font, setFont] = useState(80)
  const [mfStyle, setMfStyle] = useState({
    fontSize: font,
    padding: 10,
    border: '2px solid #1C6EA4',
  })
  const mfRef = useRef()
  const question = questions[current]

  

  useEffect(() => {
    if (hasToChange) {
      setHasToChange(false)

      const answerLatex = mfRef.current.$text('latex')
      const answerASCIIMath = mfRef.current.$text('ASCIIMath')

      answersRef.current.push({
        ASCIIMath: answerASCIIMath,
        latex: answerLatex,
        time: Date.now()-start
      })

      if (current === questions.length - 1) {
        setIsRunning(false)
        setIsFinished(true)
      } else {
        setCurrent((current) => current + 1)
        setIsRunning(false)

        mfRef.current.$perform('deleteAll')
        
      }
    }
  }, [hasToChange, current, questions.length, start])

  useInterval(
    () => {
      setHasToChange(true)
    },
    isRunning ? delay : null,
  )
  useInterval(countDown, isRunning ? 10 : null)

  useEffect(() => {
    if (!isRunning && !isFinished) {
      setDelay(question.delay)
      setIsRunning(true)
      setStart(Date.now())
    }
  }, [current, isRunning, questions, isFinished, question.delay])

  useEffect(() => {
    if (isFinished) {
      dispatch(assessmentFinished({ answers: answersRef.current }))
    }
  })

  const handleChange = () => {
    const answerASCIIMath = mfRef.current.$text('ASCIIMath')
    const e = answerASCIIMath ? math(answerASCIIMath) : ''
    if (e.type === '!! Error !!') {
      setMfStyle({ ...mfStyle, border: '2px solid red' })
    } else {
      setMfStyle({ ...mfStyle, border: '2px solid #1C6EA4' })
    }
  }

  const mfConfig = {
    onKeystroke: (el, key, evt) => {
      const content = mfRef.current.$text('ASCIIMath') // latex output fails after deletinf mathfield content
     
      if (key === 'Enter' || key === 'NumpadEnter') {
        if (content) {
         
          setHasToChange(true)
        }
      }
      return true
    },
  }

  function countDown() {
    setElapsed(Date.now() - start)
  }

  const value = ((delay - elapsed) * 100) / delay

  const increaseFont = () => {
    setFont((s) => s + 10)
    mfRef.current.$focus()
  }
  const decreaseFont = () => {
    setFont((s) => s - 10)
    mfRef.current.$focus()
  }



  return (
    <div>
      <div style={{display:'flex', flexDirection:'row'}}>
      {isRunning && (
        <CircularProgressBar
          style={{ bottom: 10 }}
          strokeWidth='20'
          sqSize='300'
          fontSize={font}
          number={current+1}
          percentage={value}
        />
      )}
      <div style={{flex:1}}/>

      <Button style={{ border: 0 }} onClick={decreaseFont}>
        <FontAwesomeIcon icon={faFont} />
      </Button>

      <Button style={{ border: 0 }} onClick={increaseFont}>
        <FontAwesomeIcon size='2x' icon={faFont} />
      </Button>
      </div>
       <div style={{textAlign:'center', marginTop:'10em', marginBottom:'10em'}}>
      <Question text={question.text} fontSize={font} style={{}}/>
      </div>
  
     
      <MathField
        autoFocus
        style={mfStyle}
        mfRef={mfRef}
        config={mfConfig}
        onChange={handleChange}
      />


      
    </div>
  )
}

export default Questions
