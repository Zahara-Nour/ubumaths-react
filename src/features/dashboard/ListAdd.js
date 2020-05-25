import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SAVE_TYPES,
  saveDb,
  saveSuccess,
  saveFailure,
  selectIsLoadingOrSaving,
} from 'features/db/dbSlice'
import { createDocument } from 'features/db/db'
import NotifAlert from 'components/NotifAlert'
import List from './List'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import TextInput from 'components/TextInput'
import { useCollection } from 'app/hooks'
import Button from 'components/CustomButtons/Button'
import AddIcon from '@material-ui/icons/Add'

function ListAdd({ path, newLabel }) {
  const dispatch = useDispatch()
  const IsLoadingOrSaving = useSelector(selectIsLoadingOrSaving)
  const [elements, , isErrorElements] = useCollection({path, listen:true})
  const [name, setName] = useState('')
  const [newName, setNewName] = useState('')

  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const cleanString = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '')
      .toLowerCase()

  const exists = (elements, name) =>
    elements.find((element) => cleanString(element.name) === cleanString(name))

  const elementExists = exists(elements, newName)

  const save = (path, document) => {
    const pathArray = path.split('/')
    const collection = pathArray[pathArray.length - 1]
    const type = SAVE_TYPES['SAVE_' + collection.toUpperCase()]
    const key = dispatch(saveDb({ type }))

    return createDocument({ path, document })
      .then(() => {
        setSavedSuccess(true)
        dispatch(saveSuccess({ data: document, type, key }))
      })
      .catch((error) => {
        setSavedError(true)
        dispatch(saveFailure({ type, key }))
      })
  }

  const saveNewElement = () => {
    let document = {
      name: newName,
      id: newName,
    }

    save(path, document).then(() => {
      setName(newName)
      setNewName('')
    })
  }

  const disabled = IsLoadingOrSaving || newName === '' || !!elementExists


  return (
    <div>
      <GridContainer>
        <GridItem xs={6}>
          <TextInput
            label={
              elementExists && !IsLoadingOrSaving
                ? `${elementExists.name} existe déjà !`
                : newLabel
            }
            text={newName}
            onChange={setNewName}
            error={!!elementExists && !IsLoadingOrSaving}
          />
        </GridItem>
        <GridItem xs={6}>
          <Button
            disabled={disabled}
            round
            justIcon
            color='rose'
            onClick={saveNewElement}
          >
            <AddIcon />
          </Button>
        </GridItem>
      </GridContainer>
      <List elements={elements} />
      {savedError && (
        <NotifAlert
          open={savedError}
          message={"L'enregistement' a échoué ! " + savedError}
          color='danger'
          onClose={() => setSavedError(false)}
        />
      )}
      {savedSuccess && (
        <NotifAlert
          open={savedSuccess}
          message={"L'enregistement' a réussi ! "}
          color='success'
          autoclose
          onClose={() => setSavedSuccess(false)}
        />
      )}
    </div>
  )
}

export default ListAdd