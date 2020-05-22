import React from 'react'
import CustomInput from 'components/CustomInput/CustomInput'

function CardNmuberInput({label, value, onChange}) {

    return (
      <CustomInput
      labelText={label}
      
      formControlProps={{
        fullWidth: true,
      }}
      inputProps={{
        type: 'number',
        value: value, 
        onChange:(evt) => onChange(evt.target.value),
      }}
    />
    )

}

export default CardNmuberInput