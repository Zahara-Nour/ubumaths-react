import React from 'react'
import Level from 'react-bulma-components/lib/components/level'
import Box from 'react-bulma-components/lib/components/box'
import { Checkbox } from 'react-bulma-components/lib/components/form'

export default function ChooseClasses({ classes, selected, onChange }) {
  const list = [].concat(selected)

  const handleChange = (evt) => {
    const index = parseInt(evt.target.name,10)
    if (list.includes(classes[index])) {
      list.splice(list.indexOf(classes[index]), 1)
    } else {
      list.push(classes[index])
    }
    onChange(list)
  }
  
  return (
    <Box>
      {classes.map((c, index) => (
        <Level key={'level' + index}>
          <Level.Side align="left">
            <Level.Item>
              <Checkbox
                name={index.toString()}
                onChange={handleChange}
                checked={selected.includes(classes[index])}
              >
                {c.id}
              </Checkbox>
            </Level.Item>
          </Level.Side>
        </Level>
      ))}
    </Box>
  )
}
