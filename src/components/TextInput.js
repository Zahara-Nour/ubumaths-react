import React from 'react'
import CustomInput from 'components/CustomInput/CustomInput'

function TextInput({
  label,
  text,
  onChange,
  success = false,
  error = false,
  multiline = false,
}) {
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
        value: text || '', // to ensure input being considered as a controlled component,
        onChange: (evt) => onChange(evt.target.value),
        multiline,
      }}
    />
  )
}

export default TextInput
