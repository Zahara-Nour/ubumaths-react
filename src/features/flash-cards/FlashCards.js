import React, { useState, useEffect } from 'react'

import { Switch, Route, Link } from 'react-router-dom'
import DisplayFlashCards from './DisplayFlashCards'
import { useSubjects, useCardsThemes } from 'app/hooks'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  CircularProgress,
  List,
  ListItem,
} from '@material-ui/core'
import styles from 'assets/jss/customSelectStyle.js'

const useStyles = makeStyles(styles)


function FlashCards({ match }) {
  return (
    <Switch>
      {/* <Route path={`${match.url}/select`} component={SelectFlashCards}/> */}
      {/* <Route path={`${match.url}/edit`} component='EditFlashCards' />
    <Route path={`${match.url}/:id`} component='DisplayFlashCards' /> */}
      <Route exact path={`${match.url}`} render={() => <Home />} />
      <Route path={`${match.url}/theme/:subject/:theme`} component={DisplayFlashCards} />
      <Route render={() => <h1>Erreur</h1>} />
    </Switch>
  )
}

function Home() {
  const classeNames = useStyles()
  const [subjects, isLoadingSubjects, isErrorSubjects] = useSubjects()
  const [subject, setSubject] = useState('')
  const [themes, isLoadingThemes, isErrorThemes] = useCardsThemes(subject)

  const handleChangeSubject = (evt) => setSubject(evt.target.value)
 

  useEffect(() => {
    if (subjects.length > 0) setSubject(subjects[0])
  }, [subjects])

  return (
    <>
      <h2>Flash Cards</h2>
      {isLoadingSubjects ? (
        <CircularProgress />
      ) : (
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
              Classe
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
      {subjects.length > 0 &&
        themes &&
        (isLoadingThemes ? (
          <CircularProgress />
        ) : (
          <List>
            {themes.map((theme, index) => (
              <ListItem key={index} button disableRipple onClick={() => {}}>
                <Link to={encodeURI(`/flash-cards/theme/${subject}/${theme}`)}>
                  <h4> {theme}</h4>
                </Link>
              </ListItem>
            ))}
          </List>
        ))}
    </>
  )
}
export default FlashCards
