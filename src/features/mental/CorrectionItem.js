import React from 'react'
import { math } from 'tinycas/build/math/math'
import 'katex/dist/katex.min.css'
import TeX from '@matejmazur/react-katex'
import List from 'react-bulma-components/lib/components/list'

function CorrectionItem({ question, number }) {
  const e = math(question.text)
  question = e.latex

  const correction = e.eval().latex
  // number = number.toString()
  const numStyle = {
    color: '#fff',
    display: 'inline-block',
    padding: '0.5em',
    marginRight: '1em',
    fontSize: '50px',
    background: '#02D1B2',
    width: '0.7em',
    height: '0.7em',
    boxSizing: 'initial',
    textAlign: 'center',
    borderRadius: '50%',
    lineHeight: '0.7em',
    // boxSizing:'contentBox'
  }

  return (
    <div style={{ fontSize: 40 }}>
      <List.Item>
        <div style={numStyle}>{number}</div>
        <TeX math={question} /> ={' '}
        <TeX style={{ color: 'green' }} math={correction} />
      </List.Item>
    </div>
  )
}

export default CorrectionItem
