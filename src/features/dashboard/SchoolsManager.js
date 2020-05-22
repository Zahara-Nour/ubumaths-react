import React, { useState, useEffect } from 'react'
import { useCollection } from 'app/hooks'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import SchoolIcon from '@material-ui/icons/School'
import Select from './Select'
import TextInput from 'components/TextInput'
import Button from 'components/CustomButtons/Button'
import AddIcon from '@material-ui/icons/Add'
import { saveToCollection } from 'features/db/db'
import { Container } from '@material-ui/core'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectIsLoadingOrSaving,
  saveDb,
  SAVE_TYPES,
  saveSuccess,
  saveFailure,
} from 'features/db/dbSlice'

function SchoolsManager() {
  const dispatch = useDispatch()
  const IsLoadingOrSaving = useSelector(selectIsLoadingOrSaving)
  const [countries, , isErrorCountries] = useCollection({
    path: 'Countries',
    listen: true,
  })
  const [country, setCountry] = useState('')
  const [newCountry, setNewCountry] = useState('')

  const [cities, , isErrorCities] = useCollection({
    path: 'Cities',
    filters: [{ country }],
    listen: true,
  })
  const [city, setCity] = useState('')
  const [newCity, setNewCity] = useState('')

  const [schools, , isErrorSchools] = useCollection({
    path: 'Schools',
    filters: [{ country }, { city }],
    listen: true,
  })

  const [school, setSchool] = useState('')
  const [newSchool, setNewSchool] = useState('')

  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const save = (collection, document) => {
    const type = SAVE_TYPES['SAVE_' + collection.toUpperCase()]
    const key = dispatch(saveDb({ type }))

    return saveToCollection({ path: collection, document })
      .then(() => {
        setSavedSuccess(true)
        dispatch(saveSuccess({ data: document, type, key }))
      })
      .catch((error) => {
        setSavedError(true)
        dispatch(saveFailure({ type, key }))
      })
  }

  return (
    <Container fixed>
      <GridContainer alignItems='center'>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <Card>
            <CardHeader color='rose' icon>
              <CardIcon color='rose'>
                <SchoolIcon />
              </CardIcon>
            </CardHeader>
            <CardBody>
              <h2>Flash Cards</h2>
              <GridContainer>
                <GridItem xs={5}>
                  <Select
                    label='Pays'
                    elements={countries}
                    element={country}
                    onChange={(name) => {
                      setCountry(name)
                      setCity('')
                      setSchool('')
                    }}
                  />
                </GridItem>
                <GridItem xs={5}>
                  <TextInput
                    label=''
                    text={newCountry}
                    onChange={setNewCountry}
                  />
                </GridItem>
                <GridItem xs={2}>
                  <Button
                    disabled={IsLoadingOrSaving || newCountry===''}
                    round
                    justIcon
                    color='rose'
                    onClick={() =>
                      save('Countries', { name: newCountry }).then(() => {
                        setCountry(newCountry)
                        setNewCountry('')
                      })
                    }
                  >
                    <AddIcon />
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={5}>
                  <Select
                    label='Ville'
                    elements={cities}
                    element={city}
                    onChange={(name) => {
                      setCity(name)
                      setSchool('')
                    }}
                  />
                </GridItem>
                <GridItem xs={5}>
                  <TextInput label='' text={newCity} onChange={setNewCity} />
                </GridItem>
                <GridItem xs={2}>
                  <Button
                    disabled={IsLoadingOrSaving || newCity === ''}
                    round
                    justIcon
                    color='rose'
                    onClick={() =>
                      save('Cities', { name: newCity, country }).then(() => {
                        setCity(newCity)
                        setNewCity('')
                      })
                    }
                  >
                    <AddIcon />
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={5}>
                <Select
                label='Etablissement'
                elements={schools}
                element={school}
                onChange={setSchool}
              />
                  
                </GridItem>
                <GridItem xs={5}>
                  <TextInput label='' text={newSchool} onChange={setNewSchool} />
                </GridItem>
                <GridItem xs={2}>
                  <Button
                    disabled={IsLoadingOrSaving || newSchool ===''}
                    round
                    justIcon
                    color='rose'
                    onClick={() =>
                      save('Schools', { name: newSchool, country, city }).then(() => {
                        setSchool(newSchool)
                        setNewSchool('')
                      })
                    }
                  >
                    <AddIcon />
                  </Button>
                </GridItem>
              </GridContainer>
              
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {savedError && (
        <SnackbarContent
          message={"L'enregistement' a échoué ! " + savedError}
          close
          color='danger'
          onClose={() => setSavedError(false)}
        />
      )}
      {savedSuccess && (
        <SnackbarContent
          message={"L'enregistement' a réussi ! "}
          close
          color='success'
          onClose={() => setSavedSuccess(false)}
        />
      )}
    </Container>
  )
}

export default SchoolsManager
