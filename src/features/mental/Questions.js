import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Question from './Question'
import '../../components/CircularProgressBar.css'
import CircularProgressBar from '../../components/CircularProgressBar.js'
import { assessmentFinished } from './mentalSlice'
import Container from 'react-bulma-components/lib/components/container'
import Section from 'react-bulma-components/lib/components/section'
import Level from 'react-bulma-components/lib/components/level'
import Button from 'react-bulma-components/lib/components/button'
import QuestionNumber from './QuestionNumber'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont } from '@fortawesome/free-solid-svg-icons'
import Mathfield from 'components/Mathfield'
import math from 'tinycas'

function Questions({ questions }) {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const [start, setStart] = useState(Date.now())
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [hasToChange, setHasToChange] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const answersRef = useRef([])
  const [delay, setDelay] = useState(0)
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

  if (hasToChange) changeQuestion()

  useInterval(() => setHasToChange(true), isRunning ? delay : null)
  useInterval(countDown, isRunning ? 500 : null)

  if (!isRunning) {
    setDelay(questions[current].delay)
    setIsRunning(true)
    setStart(Date.now())
  }

  //necessary to avoid rerendering of the Mathfield component with a new config, which would create a new Mathfield
  const mfConfigRef = useRef({
    onContentDidChange: () => {
      const answerASCIIMath = mfRef.current.$text('ASCIIMath')
      const e = answerASCIIMath ? math(answerASCIIMath) : ''
      if (e.type === '!! Error !!') {
        setMfStyle({ ...mfStyle, border: '2px solid red' })
      } else {
        setMfStyle({ ...mfStyle, border: '2px solid #1C6EA4' })
      }
    },

    onKeystroke: (el, key, evt) => {
      console.log('key', key)
      if (key === 'Enter' || key === 'NumpadEnter') {
        setHasToChange(true)
      }
      return true
    },
  })

  function changeQuestion() {
    setHasToChange(false)
    console.log('change')
    const answerLatex = mfRef.current.$text('latex')
    const answerASCIIMath = mfRef.current.$text('ASCIIMath')
    console.log('answerasciimath: ', answerASCIIMath)
    console.log('answerLatex: ', answerLatex)

    answersRef.current.push({ ASCIIMath: answerASCIIMath, latex: answerLatex })
    console.log([...answersRef.current])

    if (current === questions.length - 1) {
      console.log('fnished')
      setIsFinished(true)
    } else {
      setCurrent((current) => current + 1)
      setIsRunning(false)
      mfRef.current.$perform('deleteAll')
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

      <Container>
        <Question text={questions[current].text} fontSize={font} />
      </Container>

      <Level>
        <Level.Item>
          <div style={mfStyle}>
            <Mathfield autoFocus mfRef={mfRef} config={mfConfigRef.current} />
          </div>
        </Level.Item>
      </Level>
      <CircularProgressBar
        style={{ bottom: 10 }}
        strokeWidth='20'
        sqSize='150'
        percentage={value}
      />
    </Section>
  )
}

function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default Questions
