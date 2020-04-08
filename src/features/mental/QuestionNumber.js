import React from 'react'


const questionNumberStyle = {
    color: '#fff',
    display: 'inline-block',
    padding: '0.5em',
    marginRight: '1em',
    fontSize: '50px',
    background: '#A872B2',
    width: '0.7em',
    height: '0.7em',
    boxSizing: 'initial',
    textAlign: 'center',
    borderRadius: '50%',
    lineHeight: '0.7em',
    // boxSizing:'contentBox'
  }

export default function QuestionNumber({number}) {

    return (
        <span style= {questionNumberStyle}>
        {number}
        </span>
    )
}
