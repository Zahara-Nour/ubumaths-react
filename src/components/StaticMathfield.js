import React, { useRef, useEffect, memo } from 'react'
import 'app/mathlive.core.css'
import 'app/mathlive.css'
import MathLive from 'mathlive'

export default memo(function StaticMathfield({ text }) {
  
  const mathfieldRef = useRef(null)
  const mf = useRef()

  useEffect(() => {
    mf.current = MathLive.makeMathField(mathfieldRef.current, { readOnly: 'true' })
  }, [])

  useEffect(() => {
    mf.current.$latex(text)
  }, [text])

  return <div ref={mathfieldRef}></div>
})
