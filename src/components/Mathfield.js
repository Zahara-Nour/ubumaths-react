import React, { useRef, useEffect } from 'react'
import 'app/mathlive.core.css'
import 'app/mathlive.css'
import MathLive from 'mathlive'


function Mathfield({ id, autoFocus, config, text, mfRef }) {
  const mathfieldRef = useRef(null)

  useEffect(() => {
    mfRef.current = MathLive.makeMathField(mathfieldRef.current, config)
  }, [config, mfRef])

  useEffect(() => {
    if (autoFocus) mfRef.current.$focus()
  }, [autoFocus, mfRef])

  useEffect(() => {
    mfRef.current.$latex(text)
  }, [text, mfRef])

  return <div ref={mathfieldRef}></div>
}

export default Mathfield

