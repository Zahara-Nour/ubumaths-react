import React, { useState, useEffect } from 'react'
import { useSubjects, useDomains, useThemes } from 'app/hooks'

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  CircularProgress,
} from '@material-ui/core'
import styles from 'assets/jss/customSelectStyle.js'

const useStyles = makeStyles(styles)

function SelectScope({ needThemes, onChange }) {
  const classeNames = useStyles()
  const [subjects, isLoadingSubjects, isErrorSubjects] = useSubjects()
  const [subject, setSubject] = useState('')
  const [domains, isLoadingDomains, isErrorDomains] = useDomains(subject)
  const [domain, setDomain] = useState('')
  const [themes, isLoadingThemes, isErrorThemes] = useThemes(subject, domain)
  const [theme, setTheme] = useState('')


  const handleChangeSubject = (evt) => setSubject(evt.target.value)
  const handleChangeDomain = (evt) => setDomain(evt.target.value)
  const handleChangeTheme = (evt) => setTheme(evt.target.value)

  useEffect(() => {
    onChange({
      subject,
      domain,
      theme,
    })
  }, [subject, domain, theme, onChange])

  useEffect(() => {
    if (subjects.length > 0) setSubject(subjects[0])
  }, [subjects])

  useEffect(() => {
    if (domains.length > 0) setDomain(domains[0])
  }, [domains])

  useEffect(() => {
    if (themes.length > 0) setTheme(themes[0].label)
  }, [themes])

  return (
    <div>
      {isLoadingSubjects ? (
        <CircularProgress />
      ) : subjects.length === 0 ? null : (
        <FormControl fullWidth className={classeNames.selectFormControl}>
          <InputLabel
            htmlFor='simple-select'
            className={classeNames.selectLabel}
          >
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
            onChange={handleChangeSubject}
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
      )}
      {isLoadingDomains ? (
        <CircularProgress />
      ) : domains.length === 0 ? null : (
        <FormControl fullWidth className={classeNames.selectFormControl}>
          <InputLabel
            htmlFor='simple-select'
            className={classeNames.selectLabel}
          >
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
            onChange={handleChangeDomain}
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
      )}
      {needThemes &&
        (isLoadingThemes ? (
          <CircularProgress />
        ) : themes.length === 0 ? null : (
          <FormControl fullWidth className={classeNames.selectFormControl}>
            <InputLabel
              htmlFor='simple-select'
              className={classeNames.selectLabel}
            >
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
              onChange={handleChangeTheme}
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
        ))}
    </div>
  )
}

export default SelectScope
