import React, { useState, useEffect } from 'react'
import styles from 'assets/jss/customSelectStyle.js'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  CircularProgress,
} from '@material-ui/core'
import { useGrades } from 'app/hooks'

const useStyles = makeStyles(styles)

function SelectGrade({ onChange }) {
  const classeNames = useStyles()
  const [grades, isLoadingGrades, isErrorGrades] = useGrades()
  const [grade, setGrade] = useState('')
  const handleChangeGrade = (evt) => {
    const grade = evt.target.value
    setGrade(grade)
  }

  useEffect(() => {
    if (grades.length > 0) setGrade(grades[0])
  }, [grades])

  useEffect(() => {
    onChange(grade)
  }, [grade, onChange])

  return isLoadingGrades ? (
    <CircularProgress />
  ) : grades.length === 0 ? null : (
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
        onChange={handleChangeGrade}
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
