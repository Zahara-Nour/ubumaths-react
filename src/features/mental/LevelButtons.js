import React from 'react'
import Button from 'components/CustomButtons/Button'
import { grayColor, warningColor } from 'assets/jss/main-jss'

const flexContainerRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap ',
}

const LevelButtons = ({ levels, level, onChange }) => {

  


  const handleClick = (evt, index) => {
    evt.stopPropagation()
    onChange(index)
  }

  return (
    <div style={flexContainerRow}>
      {levels.map((q, index) => (
        <Button
          style={{
            backgroundColor: level === index ? warningColor[0] : grayColor[3],
          }}
          
          key={index}
          name={index.toString()}
          size='sm'
          onClick={(evt) => handleClick(evt, index)}
          onMouseDown={(e) => e.stopPropagation()} // workaround : https://github.com/mui-org/material-ui/issues/5104#issuecomment-521976038
        >
          {index + 1}
        </Button>
      ))}
    </div>
  )
}

export default LevelButtons
