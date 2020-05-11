import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core'
import styles from 'assets/jss/customSelectStyle.js'
import SelectSubject from './SelectSubject'
import SelectDomain from './SelectDomain'
import SelectTheme from './SelectTheme'

const useStyles = makeStyles(styles)

function SelectScope({ needThemes, onChange, defaultSubject, defaultDomain, defaultTheme }) {
  const classeNames = useStyles()

  const [subject, setSubject] = useState('')
  const [domain, setDomain] = useState('')
  const [theme, setTheme] = useState('')


  useEffect(() => {
    onChange({
      subject,
      domain,
      theme,
    })
  }, [subject, domain, theme, onChange])

  return (
    <div>
      <SelectSubject onSubject={setSubject} defaultSubject={defaultSubject}/>
      <SelectDomain subject={subject} onDomain={setDomain} defaultDomain={defaultDomain} />
      {needThemes && (
        <SelectTheme subject={subject} domain={domain} onTheme={setTheme} defaultTheme={defaultTheme}/>
      )}
    </div>
  )
}

export default SelectScope
