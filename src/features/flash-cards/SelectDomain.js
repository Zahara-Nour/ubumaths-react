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

function SelectDomain({ domains, domain, onChange }) {
  const classeNames = useStyles()

  const handleDomain = (evt) => onChange(evt.target.value)

  useEffect(()=> {
    if (domains && domains.length>0 && (!domain || !domains.includes(domain))) {
      onChange(domains[0])
    }
  }, [domains, onChange, domain])

  if (!domains || domains.length === 0) return null
  

  return (
    <FormControl fullWidth className={classeNames.selectFormControl}>
      <InputLabel htmlFor='simple-select' className={classeNames.selectLabel}>
        Domaine
      </InputLabel>
      <Select
        MenuProps={{
          className: classeNames.selectMenu,
        }}
        classes={{
          select: classeNames.select,
        }}
        value={domain}
        onChange={handleDomain}
        inputProps={{
          name: 'choose-domain',
          id: 'choose-domain',
        }}
      >
        <MenuItem
          key={'select-title'}
          disabled
          classes={{
            root: classeNames.selectMenuItem,
          }}
        >
          Domaine
        </MenuItem>
        {domains.map((domain) => (
          <MenuItem
            key={domain}
            classes={{
              root: classeNames.selectMenuItem,
              selected: classeNames.selectMenuItemSelected,
            }}
            value={domain}
          >
            {domain}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectDomain
