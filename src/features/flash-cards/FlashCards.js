import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router-dom'
import DisplayFlashCards from './DisplayFlashCards'
import NavBar from 'components/NavBar'
import { useSelector } from 'react-redux'
import { selectMaintenanceMode } from 'features/maintenance/maintenanceSlice'
import SelectGrade from './SelectGrade'
import ThemesList from './ThemesList'
import { Container, CircularProgress } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Maintenance from 'components/Maintenance'
import SelectSubject from './SelectSubject'
import SelectDomain from './SelectDomain'
import SelectTheme from './SelectTheme'
import { useSubjects, useDomains, useThemes, useGrades } from 'app/hooks'

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
        <meta name='keywords' content='Flash, Cards, math, latex'/>
      </Helmet>
      <Switch>
        <Route exact path={`${match.url}`} render={() => <Home />} />
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
  const [grades, , isErrorGrades] = useGrades()
  const [grade, setGrade] = useState('')
  const [subjects, , isErrorSubjects] = useSubjects()
  const [subject, setSubject] = useState('')
  const [domains, , isErrorDomains] = useDomains(subject)
  const [domain, setDomain] = useState('')
  const [themes, , isErrorThemes] = useThemes(subject, domain)
  const [theme, setTheme] = useState('')

  return (
    <>
      <NavBar />
      <Container fixed>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3} lg={3}>
            <h2>Flash Cards</h2>

            <SelectSubject
              subjects={subjects}
              subject={subject}
              onChange={setSubject}
            />

            <SelectDomain
              domains={domains}
              domain={domain}
              onChange={setDomain}
            />

            <SelectTheme themes={themes} theme={theme} onChange={setTheme} />

            <SelectGrade grades={grades} grade={grade} onChange={setGrade} />

            <ThemesList subject={subject} domain={domain} grade={grade} />
          </GridItem>
        </GridContainer>
      </Container>
    </>
  )
}
export default FlashCards
