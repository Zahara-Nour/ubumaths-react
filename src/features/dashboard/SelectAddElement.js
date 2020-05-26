import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import {
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
import { useWhatChanged, useFilters } from 'app/hooks'


function SelectAddElement({
  path,
  label,
  newLabel,
  children,
  filters,
  filterNameAppended = false,
  filterName,
  add = true,
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
  filters=useFilters(filters)

  const [isSaving, setIsSaving] = useState(false)
  const [elements, isLoadingElements, isErrorElements] = useCollection({
    path,
    filters,
    listen:add,
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
  let value = ''

  if (name && filters.length && elements.find((elt) => elt.name === name)) {
   
    let name
    filters.forEach((filter) => {
      name = Object.getOwnPropertyNames(filter)[0]
      // console.log('name', name)
      value = value  ? value + '_' + filter[name] : filter[name] 
      // console.log('value', value)
    })
    dependanceName = name
    dependanceValue = value
   
  }
  elementId = value ? value + '_' + name : name
  newElementId = value ? value + '_' + newName : newName

  // console.log('id', elementId)
  // console.log('newid', newElementId)

  const newFilters = useMemo(
    () =>
      filterNameAppended
        ? {
            filters: [{ [filterName]: elementId }],
          }
        : filters.concat({ [filterName]: name }),
    [filterName, elementId, filterNameAppended, filters, name],
  )
  // console.log('newFilters', newFilters)
  const disabled = isLoadingElements || isSaving || newName === '' || !!elementExists

  const save = (path, document) => {
    setIsSaving(true)
    const pathArray = path.split('/')
    const collection = pathArray[pathArray.length - 1]
    const type = SAVE_TYPES['SAVE_' + collection.toUpperCase()]
    const key = dispatch(saveDb({ type }))

    return createDocument({ path, document })
      .then(() => {
        setIsSaving(false)
        setSavedSuccess(true)
        dispatch(saveSuccess({ data: document, type, key }))
      })
      .catch((error) => {
        setIsSaving(false)
        setSavedError(true)
        dispatch(saveFailure({ type, key }))
      })
  }

  const saveNewElement = () => {
    let document = {
      name: newName,
      id: newElementId,
    }
    if (filterNameAppended && filters.length) {
      document = { ...document, [dependanceName]: dependanceValue }
    }
    save(path, document).then(() => {
      setName(newName)
      setNewName('')
    })
  }

  console.log('\nselect', label)
  console.log('filters', filters)
  console.log('name',name)
  console.log('elementId',elementId)
  console.log('newFilters', newFilters)

  // console.log('elements', elements)
  return (
    <div>
      <GridContainer>
        <GridItem xs={add ? 5 : 12}>
          <Select
            label={label}
            elements={elements}
            name={name}
            onChange={setName}
          />
        </GridItem>
        {add && (
          <GridItem xs={5}>
            <TextInput
              label={
                elementExists && !isLoadingElements && !isSaving
                  ? `${elementExists.name} existe déjà !`
                  : newLabel
              }
              text={newName}
              onChange={setNewName}
              error={!!elementExists && !isLoadingElements && !isSaving}
            />
          </GridItem>
        )}
        {add && (
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
        )}
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
      {name &&
        children &&
        React.cloneElement(children, { ...newFilters, id: elementId })}
    </div>
  )
}

export default React.memo(SelectAddElement)
