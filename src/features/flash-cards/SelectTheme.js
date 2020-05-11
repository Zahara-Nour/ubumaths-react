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

function SelectTheme({ themes, theme, onChange }) {
  const classeNames = useStyles()

  const handleTheme = (evt) => onChange(evt.target.value)

  useEffect(() => {
    if (themes && themes.length > 0 && (!theme || !themes.includes(theme))) onChange(themes[0].label)
  }, [themes, onChange, theme])

  if (!themes || themes.length === 0) return null

  return (
    <FormControl fullWidth className={classeNames.selectFormControl}>
      <InputLabel htmlFor='simple-select' className={classeNames.selectLabel}>
        Thème
      </InputLabel>
      <Select
        MenuProps={{
          className: classeNames.selectMenu,
        }}
        classes={{
          select: classeNames.select,
        }}
        value={theme}
        onChange={handleTheme}
        inputProps={{
          name: 'choose-theme',
          id: 'choose-theme',
        }}
      >
        <MenuItem
          key={'select-title'}
          disabled
          classes={{
            root: classeNames.selectMenuItem,
          }}
        >
          Thème
        </MenuItem>
        {themes.map((theme) => (
          <MenuItem
            key={theme.id}
            classes={{
              root: classeNames.selectMenuItem,
              selected: classeNames.selectMenuItemSelected,
            }}
            value={theme.label}
          >
            {theme.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectTheme
