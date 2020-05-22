import React from 'react'
import CustomInput from 'components/CustomInput/CustomInput'

function TextInput({label, text, onChange}) {

    return (
        <CustomInput
            labelText={label}
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              value: text || '', // to ensure input being considered as a controlled component,
              onChange: (evt) => onChange(evt.target.value),
              multiline:true
            }}
          />
    )

}

export default TextInput