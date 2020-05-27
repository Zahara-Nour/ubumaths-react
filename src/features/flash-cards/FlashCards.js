import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router-dom'
import DisplayFlashCards from './DisplayFlashCards'
import NavBar from 'components/NavBar'
import { useSelector } from 'react-redux'
import { selectMaintenanceMode } from 'features/maintenance/maintenanceSlice'

import ThemesList from './ThemesList'
import { Container } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Maintenance from 'components/Maintenance'

import {  useCollection } from 'app/hooks'
import Filter from 'components/Filter'
import Select from 'components/Select'

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
  const [grades, ,] = useCollection({path:'Grades'})
  const [grade, setGrade] = useState('')
  console.log('grades', grades)

  useEffect(()=> {
    if (grades && grades.length) {
      console.log('setGrade', grades[0])
      setGrade(grades[0].name)
    }
  },[grades])

  return (
    <>
      <NavBar />
      <Container fixed>
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
      </Container>
    </>
  )
}

export default FlashCards
