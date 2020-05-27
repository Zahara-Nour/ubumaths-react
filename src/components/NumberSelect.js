import React from 'react'
import Button from 'components/CustomButtons/Button'
import {grayColor} from 'assets/jss/main-jss'

export default function NumberSelect({ name, value, onClick }) {
  const handlePlus = (e) => {
    e.stopPropagation()

    onClick(value + 1)
  }
  const handleMinus = (e) => {
    e.stopPropagation()

    onClick(value - 1)
  }

  // const flexContainerColumn = {
  //   display: 'flex',
  //   flexDirection: 'column'

  // }

  const flexContainerRow = {
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center'
  }



  return (
    <div style={flexContainerRow}>
      
     
      <Button style= {{margin:'5px', backgroundColor:grayColor[3] }}  size='sm' onClick={handlePlus}>
        +
      </Button>
      <Button style= {{margin:'5px', backgroundColor:grayColor[3] }}  size='sm' onClick={handleMinus}>
        -
      </Button>
      <div style= {{margin:'5px'}}>
      {name}: {value}
      </div>
     
    </div>
  )
}
