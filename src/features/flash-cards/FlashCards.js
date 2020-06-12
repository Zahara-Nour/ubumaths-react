import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router-dom'
import DisplayFlashCards from './DisplayCards'
import NavBar from 'components/NavBar'
import { useSelector } from 'react-redux'
import { selectMaintenanceMode } from 'features/maintenance/maintenanceSlice'

import ThemesList from './ThemesList'
import { Container } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Maintenance from 'components/Maintenance'

import { useCollection } from 'app/hooks'
import Filter from 'components/Filter'
import Select from 'components/Select'
import DisplayUserCards from './DisplayUserCards'
import { makeStyles } from '@material-ui/core/styles'
import SwitchUI from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styles from 'assets/jss/customCheckboxRadioSwitch.js'
import { selectIsLoggedIn } from 'features/auth/authSlice'
import PrivateRoute from 'components/PrivateRoute'

const useStyles = makeStyles(styles)

function FlashCards({ match }) {
  const maintenance = useSelector(selectMaintenanceMode)

  if (maintenance) return <Maintenance />

  return (
    <div>
      <Helmet>
        <title>Ubu Maths - Flash Cards</title>
        <meta
          name='description'
          content='Créer et utiliser des jeux de Flash Cards pour réviser une matière, une notion.'
        />
        <meta name='keywords' content='Flash, Cards, math, latex' />
      </Helmet>
      <Switch>
        <Route exact path={`${match.url}`} component={Home} />
    
        <PrivateRoute
          path={`${match.url}/user/:subject/:theme/`}
          render={({ match }) => (
            <DisplayUserCards
              subject={match.params.subject}
              theme={match.params.theme}
            />
          )}
        />
        <Route
          path={`${match.url}/:subject/:domain/:theme/:level`}
          component={DisplayFlashCards}
        />
        <Route render={() => <h1>Erreur</h1>} />
      </Switch>
    </div>
  )
}

function Home() {
  const [grades, ,] = useCollection({ path: 'Grades' })
  const [grade, setGrade] = useState('')
  const [checkedPersonnal, setCheckedPersonnal] = useState(false)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const classes = useStyles()

  useEffect(() => {
    if (grades && grades.length) {
      setGrade(grades[0].name)
    }
  }, [grades])

  return (
    <>
      <NavBar />
      <Container fixed>
        {isLoggedIn && (
          <FormControlLabel
            control={
              <SwitchUI
                checked={checkedPersonnal}
                onChange={(event) => setCheckedPersonnal(event.target.checked)}
                classes={{
                  switchBase: classes.switchBase,
                  checked: classes.switchChecked,
                  thumb: classes.switchIcon,
                  track: classes.switchBar,
                }}
              />
            }
            classes={{
              label: classes.label,
            }}
            label='Flash Cards personnelles'
          />
        )}
        {checkedPersonnal ? (
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h3>Flash Cards</h3>

              <Filter
                type='select'
                path='Subjects'
                label='Matière'
                newLabel='Nouvelle matière'
                filterName='subject'
              >
                <ThemesList grade={grade} user />
              </Filter>
            </GridItem>
          </GridContainer>
        ) : (
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h3>Flash Cards</h3>
              <Select
                label='Niveau'
                elements={grades}
                selected={grade}
                onChange={setGrade}
              />
              <Filter
                type='select'
                path='Subjects'
                label='Matière'
                newLabel='Nouvelle matière'
                filterName='subject'
              >
                <Filter
                  type='select'
                  path='Domains'
                  label='Domaine'
                  newLabel='Nouveau domaine'
                  filterName='domain'
                  filterNameAppended
                >
                  <ThemesList grade={grade} />
                </Filter>
              </Filter>
            </GridItem>
          </GridContainer>
        )}
      </Container>
    </>
  )
}

export default FlashCards
