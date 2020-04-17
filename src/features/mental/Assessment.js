import React from 'react'
import { useSelector } from 'react-redux'
import Questions from './Questions'
import Correction from './Correction'
import {selectFinished, selectGeneratedQuestions} from './mentalSlice'


function Assessment() {
  const finished = useSelector(selectFinished)
  const questions = useSelector(selectGeneratedQuestions)
  

  if (finished) return <Correction questions={questions}/>

  return <Questions questions={questions} />
}


export default Assessment
