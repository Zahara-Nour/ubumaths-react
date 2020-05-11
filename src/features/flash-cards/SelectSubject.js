import React, { useEffect } from 'react'
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  makeStyles,
} from '@material-ui/core'
import styles from 'assets/jss/customSelectStyle.js'

const useStyles = makeStyles(styles)

function SelectSubject({ subjects, subject, onChange }) {
  const classeNames = useStyles()

  const handleSubject = (evt) => onChange(evt.target.value)

  useEffect(()=> {
    if (subjects && subjects.length>0 && !subject) onChange(subjects[0])
  }, [subjects, onChange, subject])

  if (!subjects || subjects.length === 0) return null
  

  return (
    <FormControl fullWidth className={classeNames.selectFormControl}>
      <InputLabel htmlFor='simple-select' className={classeNames.selectLabel}>
        Matière
      </InputLabel>
      <Select
        MenuProps={{
          className: classeNames.selectMenu,
        }}
        classes={{
          select: classeNames.select,
        }}
        value={subject}
        onChange={handleSubject}
        inputProps={{
          name: 'choose-subject',
          id: 'choose-subject',
        }}
      >
        <MenuItem
          key={'select-title'}
          disabled
          classes={{
            root: classeNames.selectMenuItem,
          }}
        >
          Matière
        </MenuItem>
        {subjects.map((subject, index) => (
          <MenuItem
            key={subject}
            classes={{
              root: classeNames.selectMenuItem,
              selected: classeNames.selectMenuItemSelected,
            }}
            value={subject}
          >
            {subject}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectSubject
