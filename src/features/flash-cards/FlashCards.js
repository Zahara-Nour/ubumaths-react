import React, { useState, useCallback } from 'react'
import { Switch, Route } from 'react-router-dom'
import DisplayFlashCards from './DisplayFlashCards'
import NavBar from 'components/NavBar'
import { useSelector } from 'react-redux'
import { selectMaintenanceMode } from 'features/maintenance/maintenanceSlice'
import SelectScope from './SelectScope'
import SelectGrade from './SelectGrade'
import ThemesList from './ThemesList'
import { Container } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'

function FlashCards({ match }) {
  const maintenance = useSelector(selectMaintenanceMode)
  if (maintenance) return <h2>Le site est en cours de maintenance</h2>
  return (
    <Switch>
      {/* <Route path={`${match.url}/select`} component={SelectFlashCards}/> */}
      {/* <Route path={`${match.url}/edit`} component='EditFlashCards' />
    <Route path={`${match.url}/:id`} component='DisplayFlashCards' /> */}
      <Route exact path={`${match.url}`} render={() => <Home />} />
      {/* <Route path={`${match.url}/edit`} component={EditFlashCards} />
      <Route path={`${match.url}/create`} component={CreateFlashCards} /> */}
      <Route
        path={`${match.url}/:subject/:domain/:theme/:level`}
        component={DisplayFlashCards}
      />
      <Route render={() => <h1>Erreur</h1>} />
    </Switch>
  )
}

function Home() {
  const [subject, setSubject] = useState('')
  const [domain, setDomain] = useState('')
  const [grade, setGrade] = useState('')

  const handleSelectScope = useCallback(({ subject, domain }) => {
    setDomain(domain)
    setSubject(subject)
  },[]) 

  return (
    <>
      <NavBar />
      <Container fixed>
      <GridContainer>
      <GridItem xs={12} sm={12} md={3} lg={3}>
      <h2>Flash Cards</h2>

      <SelectScope onChange={handleSelectScope} />
      <SelectGrade onChange={setGrade} />
      <ThemesList subject={subject} domain={domain} grade={grade} />
      </GridItem>
    </GridContainer>
      </Container>
    </>
  )
}
export default FlashCards
