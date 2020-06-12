import React from 'react'
import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  MenuItem,
  makeStyles,
} from '@material-ui/core'
import styles from 'assets/jss/customSelectStyle.js'

const useStyles = makeStyles(styles)

function Select({ label, elements, selected, onChange }) {
  const classeNames = useStyles()
  const handleSelect = (evt) => onChange(evt.target.value)

  // console.log(`select ${label} ${selected}`, elements)

  if (!elements || elements.length === 0 || !selected) return null
  // console.log(`Going to render ${label}`)
  return (
    <FormControl fullWidth className={classeNames.selectFormControl}>
      <InputLabel htmlFor='simple-select' className={classeNames.selectLabel}>
        {label}
      </InputLabel>
      <MuiSelect
        MenuProps={{
          className: classeNames.selectMenu,
        }}
        classes={{
          select: classeNames.select,
        }}
        //  value={ element }
        value={
          selected && elements.find((elt) => elt.name === selected)
            ? selected
            : ''
        }
        onChange={handleSelect}
        inputProps={{
          name: `choose-${label}`,
          key: `choose-${label}`, // to preserve focus
        }}
      >
        <MenuItem
          key={'select-title'}
          disabled
          classes={{
            root: classeNames.selectMenuItem,
          }}
        >
          {label}
        </MenuItem>
        {elements.map((element) => (
          <MenuItem
            key={element.name}
            classes={{
              root: classeNames.selectMenuItem,
              selected: classeNames.selectMenuItemSelected,
            }}
            value={element.name}
          >
            {element.name}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}

export default Select
