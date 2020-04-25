import React, { useState } from 'react'
import styles from 'assets/jss/customSelectStyle.js'
import {
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'

const useStyles = makeStyles(styles)

export default function ChooseStudents({ students, selected, onChange }) {
  const classeNames = useStyles()
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

  const classes = Object.getOwnPropertyNames(students)
 

  return (
    <div>
      <FormControl fullWidth className={classeNames.selectFormControl}>
        <InputLabel htmlFor='simple-select' className={classeNames.selectLabel}>
          Classe
        </InputLabel>
        <Select
          MenuProps={{
            className: classeNames.selectMenu,
          }}
          classes={{
            select: classeNames.select,
          }}
          value={selectedClass}
          onChange={handleChangeClass}
          inputProps={{
            name: 'choose-class',
            id: 'choose-class',
          }}
        >
          <MenuItem
            key={'select-title'}
            disabled
            classes={{
              root: classeNames.selectMenuItem,
            }}
          >
            Classe
          </MenuItem>
          {classes.map((c, index) => (
            <MenuItem
              key={c}
              classes={{
                root: classeNames.selectMenuItem,
                selected: classeNames.selectMenuItemSelected,
              }}
              value={index}
            >
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl  component='fieldset' className={classeNames.formControl}>
        
        <FormGroup>
          {students[classes[selectedClass]].map((student, index) => (
              <FormControlLabel
                key={student.email}
                control={
                  <Checkbox
                    checked={selected.includes(student.email)}
                    onChange={handleChange}
                    name={student.email}
                  />
                }
                label={student.email}
              />
            ))}
        </FormGroup>
      </FormControl>
    </div>
  )
}
