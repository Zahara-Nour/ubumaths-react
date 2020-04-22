import React, { useState } from 'react'
import Level from 'react-bulma-components/lib/components/level'
import Box from 'react-bulma-components/lib/components/box'
import { Checkbox, Select } from 'react-bulma-components/lib/components/form'

export default function ChooseStudents({ classes, selected, onChange }) {
  const [selectedClass, setSelectedclass] = useState(0)

  const selectedStudents = [].concat(selected)
  const handleChangeClass = (evt) => {
    const value = evt.target.value
    setSelectedclass(value)
  }

  const handleChange = (evt) => {
    const name = evt.target.name
    if (selectedStudents.includes(name)) {
      const index = selectedStudents.indexOf(name)
      selectedStudents.splice(index, 1)
    } else {
      selectedStudents.push(evt.target.name)
    }
    onChange(selectedStudents)
  }
  console.log(classes)
  return (
    <Box>
      <Select onChange={handleChangeClass} name="class" value={selectedClass}>
        {classes.map((c, index) => (
          <option key={'select' + index} value={index}>
            {c.id}
          </option>
        ))}
      </Select>
      {classes.length>0 && classes[selectedClass].students &&
        classes[selectedClass].students.map((student, index) => (
          <Level key={'level' + index}>
            <Level.Side align="left">
              <Level.Item>
                <Checkbox
                  name={student}
                  onChange={handleChange}
                  checked={selected.includes(student)}
                >
                  {student}
                </Checkbox>
              </Level.Item>
            </Level.Side>
          </Level>
        ))}
    </Box>
  )
}
