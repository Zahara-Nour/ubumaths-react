import React, { useState, useEffect, useRef } from 'react'
import Question from './Question'
import '../../components/CircularProgressBar.css'
import CircularProgressBar from '../../components/CircularProgressBar.js'
import { assessmentFinished } from './mentalSlice'
import Section from 'react-bulma-components/lib/components/section'
import Level from 'react-bulma-components/lib/components/level'
import Button from 'react-bulma-components/lib/components/button'
import QuestionNumber from './QuestionNumber'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont } from '@fortawesome/free-solid-svg-icons'
import MathField from 'react-mathfield'
import math from 'tinycas'
import {useInterval} from 'app/hooks'
import './mental.css'

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

  useEffect(() => {
    if (isFinished) {
      dispatch(assessmentFinished({ answers: answersRef.current }))
    }
  })

  useEffect(() => {
    if (hasToChange) {
      setHasToChange(false)

      const answerLatex = mfRef.current.$text('latex')
      const answerASCIIMath = mfRef.current.$text('ASCIIMath')

      answersRef.current.push({
        ASCIIMath: answerASCIIMath,
        latex: answerLatex,
      })

      if (current === questions.length - 1) {
        setIsFinished(true)
      } else {
        setCurrent((current) => current + 1)
        setIsRunning(false)
        
        mfRef.current.$perform('deleteAll')
        console.log('delete',mfRef.current.$text())
      
      }
    }
  }, [hasToChange, current, questions.length])

  useInterval(
    () => {
      setHasToChange(true)
    },
    isRunning ? delay : null,
  )
  useInterval(countDown, isRunning ? 10 : null)

  useEffect(() => {
    if (!isRunning) {
      setDelay(questions[current].delay)
      setIsRunning(true)
      setStart(Date.now())
    }
  }, [current, isRunning, questions])

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
      console.log('stoke text', content) 
      if (key === 'Enter' || key === 'NumpadEnter') {
        
        if (content) {
          console.log('content not empty', content)
          setHasToChange(true)
        }
      }
      return true
    }
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
    <Section>
      <Level>
        <Level.Side align='left'>
          <Level.Item>
            <QuestionNumber number={current + 1} />
          </Level.Item>
        </Level.Side>
        <Level.Side align='right'>
          <Level.Item>
            <Button style={{ border: 0 }} onClick={decreaseFont}>
              <FontAwesomeIcon icon={faFont} />
            </Button>
          </Level.Item>
          <Level.Item>
            <Button style={{ border: 0 }} onClick={increaseFont}>
              <FontAwesomeIcon size='2x' icon={faFont} />
            </Button>
          </Level.Item>
        </Level.Side>
      </Level>

     <Level>
     <Level.Item>
        <Question text={questions[current].text} fontSize={font} />
        </Level.Item>
        </Level>

      <Level>
        <Level.Item>
          
            <MathField autoFocus style={mfStyle} mfRef={mfRef} config={mfConfig} onChange={handleChange} />
          
        </Level.Item>
      </Level>
      {isRunning && <CircularProgressBar
        style={{ bottom: 10 }}
        strokeWidth='20'
        sqSize='150'
        percentage={value}
      />}
    </Section>
  )
}



export default Questions
