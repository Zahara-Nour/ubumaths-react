import React, { useRef, useEffect } from 'react'
import 'app/mathlive.core.css'
import 'app/mathlive.css'
import MathLive from 'mathlive'
import withPropsChecker from './withPropsChecker'

function Mathfield({ id, autoFocus, config, text, mfRef }) {
  const mathfieldRef = useRef(null)

  useEffect(() => {
    mfRef.current = MathLive.makeMathField(mathfieldRef.current, config)

    console.log('useEffect config')
  }, [config, mfRef])

  useEffect(() => {
    if (autoFocus) mfRef.current.$focus()
    console.log('useEffect autofocus')
  }, [autoFocus, mfRef])

  useEffect(() => {
    mfRef.current.$latex(text)
    console.log('useEffect text')
  }, [text, mfRef])

  return <div ref={mathfieldRef}></div>
}

export default withPropsChecker(Mathfield)

