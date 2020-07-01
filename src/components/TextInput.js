import React, { useEffect, useState, useRef } from 'react'
import CustomInput from 'components/CustomInput/CustomInput'
// const throttleFunc = require('lodash.throttle')
import { throttle as throttleFunc } from 'lodash'


function TextInput({
  label,
  text,
  onChange,
  success = false,
  error = false,
  multiline = false,
  throttle,
  defaultText
}) {


  const changeValue = useRef(
    throttleFunc((value) => {
      // console.log('throotle', value)
      onChange(value)
    }, throttle,{leading:true})
  )

  const [innerText, setInnerText] = useState(text || '')

  const innerOnChange = (evt) => {

    const value = evt.target.value
    if (throttle) {
      setInnerText(value)
      changeValue.current(value)
    } else {
      
      onChange(value)
    }
  }

  useEffect(()=> setInnerText(defaultText),[defaultText])

  return (
    <CustomInput
      labelText={label}
      success={success}
      error={error}
      formControlProps={{
        fullWidth: true,
      }}
      inputProps={{
        type: 'text',
        value: (throttle ? innerText : text) || '', // to ensure input being considered as a controlled component,
        onChange: innerOnChange,
        multiline,
      }}
    />
  )
}

export default TextInput
