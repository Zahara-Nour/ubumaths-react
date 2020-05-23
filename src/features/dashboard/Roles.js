import React, { useState } from 'react'
import { useCollection } from 'app/hooks'
import List from './List'
import Button from 'components/CustomButtons/Button'
import { Container } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import WorkOutlineIcon from '@material-ui/icons/WorkOutline'
import TextInput from 'components/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectIsLoadingOrSaving,
  SAVE_TYPES,
  saveDb,
  saveSuccess,
  saveFailure,
} from 'features/db/dbSlice'
import AddIcon from '@material-ui/icons/Add'
import { saveToCollection, createDocument } from 'features/db/db'
import SnackbarContent from 'components/Snackbar/SnackbarContent'

function Roles() {
  const dispatch = useDispatch()
  const collection = 'Roles'
  const IsLoadingOrSaving = useSelector(selectIsLoadingOrSaving)
  const [roles, ,] = useCollection({ path: 'Roles', listen: true })
  const [role, setRole] = useState(0)
  const [newRole, setNewRole] = useState('')

  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const save = (collection, document) => {
    const type = SAVE_TYPES['SAVE_' + collection.toUpperCase()]
    const key = dispatch(saveDb({ type }))

    return createDocument({ path: collection, document })
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
                <WorkOutlineIcon />
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={8}>
                  <TextInput label='' text={newRole} onChange={setNewRole} />
                </GridItem>
                <GridItem xs={4}>
                  <Button
                    disabled={IsLoadingOrSaving || newRole === ''}
                    round
                    justIcon
                    color='rose'
                    onClick={() =>
                      save(collection, { name: newRole, id:newRole }).then(() => {
                        setNewRole('')
                      })
                    }
                  >
                    <AddIcon />
                  </Button>
                </GridItem>
              </GridContainer>
              <List elements={roles}></List>
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

export default Roles
