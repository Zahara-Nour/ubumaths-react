import React, { useEffect } from 'react'
import styles from 'assets/jss/customSelectStyle.js'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(styles)

function SelectGrade({ grades, grade, onChange }) {
  const classeNames = useStyles()

  useEffect(() => {
    if (grades && grades.length > 0) onChange(grades[0])
  }, [grades, onChange])

  if (!grades || grades.length === 0) return null

  return (
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
        value={grade}
        onChange={(evt) => onChange(evt.target.value)}
        inputProps={{
          name: 'choose-grade',
          id: 'choose-grade',
        }}
      >
        <MenuItem
          key={'select-title'}
          disabled
          classes={{
            root: classeNames.selectMenuItem,
          }}
        >
          Niveau
        </MenuItem>
        {grades.map((grade, index) => (
          <MenuItem
            key={grade}
            classes={{
              root: classeNames.selectMenuItem,
              selected: classeNames.selectMenuItemSelected,
            }}
            value={grade}
          >
            {grade}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectGrade
