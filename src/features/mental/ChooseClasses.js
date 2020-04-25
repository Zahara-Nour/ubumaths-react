import React from 'react'
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'

export default function ChooseClasses({
  classes,
  selected,
  onChange,
  ...rest
}) {
  const list = [].concat(selected)

  const handleChange = (evt) => {
    const index = parseInt(evt.target.name, 10)
    if (list.includes(classes[index])) {
      list.splice(list.indexOf(classes[index]), 1)
    } else {
      list.push(classes[index])
    }
    onChange(list)
  }

  return (
    <FormControl component='fieldset' className={classes.formControl} {...rest}>
      <FormGroup>
        {classes.map((c, index) => (
          <FormControlLabel
            key='index'
            control={
              <Checkbox
                checked={selected.includes(classes[index])}
                onChange={handleChange}
                name={index.toString()}
              />
            }
            label={c}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
