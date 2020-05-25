import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectIsLoadingOrSaving,
  SAVE_TYPES,
  saveDb,
  saveSuccess,
  saveFailure,
} from 'features/db/dbSlice'
import { useCollection } from 'app/hooks'
import { createDocument } from 'features/db/db'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Select from './Select'
import AddIcon from '@material-ui/icons/Add'
import NotifAlert from 'components/NotifAlert'
import TextInput from 'components/TextInput'
import Button from 'components/CustomButtons/Button'
import { useWhatChanged } from 'app/hooks'

function SelectAddElement({
  path,
  label,
  newLabel,
  children,
  filter,
  filterName,
  ...rest
}) {
  // console.log(' *** ', path)
  // useWhatChanged(`${path} props changed`, {
  //   path,
  //   label,
  //   newLabel,
  //   children,
  //   filters,
  //   filterName,
  //   ...rest,
  // })
  const dispatch = useDispatch()
  const IsLoadingOrSaving = useSelector(selectIsLoadingOrSaving)

  // console.log('filters', filters)

  const [elements, , isErrorElements] = useCollection({
    path,
    filters: filter ? [filter] : [],
    listen: true,
  })
  const [name, setName] = useState('')
  const [newName, setNewName] = useState('')

  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // useWhatChanged(`${path} state changed`, {
  //   elements,
  //   name,
  //   newName,
  // })

  //remove accents, spaces ...

  const cleanString = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '')
      .toLowerCase()

  const exists = (elements, name) =>
    elements.find((element) => cleanString(element.name) === cleanString(name))

  const elementExists = exists(elements, newName)

  let elementId = ''
  let newElementId = ''
  let dependanceName = ''
  let dependanceValue = ''

  if (name && elements.find((elt) => elt.name === name)) {
    if (filter) {
      const name = Object.getOwnPropertyNames(filter)[0]
      // console.log('name', name)
      const value = filter[name]
      // console.log('value', value)
      elementId = value + '-'
    }
    elementId = elementId + name
  }

  if (filter) {
    const name = Object.getOwnPropertyNames(filter)[0]
    // console.log('name', name)
    const value = filter[name]
    // console.log('value', value)
    dependanceName = name
    dependanceValue = value
    newElementId = value + '-'
  }
  newElementId = newElementId + newName
  // console.log('id', elementId)
  // console.log('newid', newElementId)

  const newFilter = useMemo(
    () => ({
      filter: { [filterName]: elementId },
    }),
    [filterName, elementId],
  )
  // console.log('newFilters', newFilters)
  const disabled = IsLoadingOrSaving || newName === '' || !!elementExists

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
      id: newElementId,
    }
    if (filter) {
      document = { ...document, [dependanceName]: dependanceValue }
    }
    save(path, document).then(() => {
      setName(newName)
      setNewName('')
    })
  }

  // console.log('elements', elements)
  return (
    <div>
      <GridContainer>
        <GridItem xs={5}>
          <Select
            label={label}
            elements={elements}
            name={name}
            onChange={setName}
          />
        </GridItem>
        <GridItem xs={5}>
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
        <GridItem xs={2}>
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
      {name && children && React.cloneElement(children, {...newFilter, id:elementId})}
    </div>
  )
}

export default React.memo(SelectAddElement)
