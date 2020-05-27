import React, { useState, useMemo, useEffect, useCallback } from 'react'
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
import { useFilters } from 'app/hooks'
import List from './List'

function Filter({
  path,
  label,
  newLabel,
  children,
  filters,
  defaultFilters,
  filterNameAppended = false,
  filterName,
  type,
  add = false,
  sort,
  render,
  listen = false,
  ...rest
}) {
  const dispatch = useDispatch()
  const [throwDefaults, setThrowDefaults] = useState(false)

  // most important : filters to trigger fetching collection and to set default names
  // console.log(`\nparam defaultFilters for ${path}`, defaultFilters)
  filters = useFilters(filters)
  // console.log(`filters for ${path}`, filters)
  defaultFilters = useFilters(defaultFilters)
  // console.log('default filters', defaultFilters)

  const defaults = useMemo(() => defaultFilters && !!defaultFilters.length, [
    defaultFilters,
  ])

  let dependanceName = ''
  let dependanceValue = ''

  filters.forEach((filter) => {
    dependanceName = Object.getOwnPropertyNames(filter)[0]
    dependanceValue = dependanceValue
      ? dependanceValue + '_' + filter[dependanceName]
      : filter[dependanceName]
  })
  const dependance = useMemo(() => [{ [dependanceName]: dependanceValue }], [
    dependanceName,
    dependanceValue,
  ])

  const [isSaving, setIsSaving] = useState(false)
  const [elements, isLoadingElements] = useCollection({
    path,
    filters: filterNameAppended ? dependance : filters,
    listen: add || listen,
    sort,
  })
  // console.log(`${path} elements`, elements)
  const defaultName = useMemo(() => {
    if (defaults) {
      const filter = defaultFilters[0]
      const name = Object.getOwnPropertyNames(filter)[0]
      return filter[name]
    } else return ''
  }, [defaults, defaultFilters])

  // console.log(`dFilters for ${path} : `, dFilters)

  // console.log(
  //   `getDefaultFilterValue for ${path}`,
  //   dFilters && dFilters.length ? getDefaultFilterValue() : '',
  // )
  const [name, setName] = useState('')
  const [newName, setNewName] = useState('')
  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // useWhatChanged(`${path} state changed`, {
  //   elements,
  //   name,
  //   newName,
  // })

  useEffect(() => {
    if (elements && elements.length && (!defaults)) {
      // console.log(`going to set name of ${path} with `, elements[0].name)
      setName(elements[0].name)
    }
  }, [elements, defaults])

  useEffect(() => {
    // console.log('useEffect defaultFilers')
    if (defaults) {
      // console.log(`going to set name of ${path} with default`, defaultName)
      setName(defaultName)
      setThrowDefaults(false)
    }
  }, [defaults, defaultName])

  const newFilters = useMemo(
    () => ({ filters: filters.concat({ [filterName]: name }) }),
    [filterName, filters, name],
  )

  const checked =
    elements &&
    elements.length &&
    name &&
    elements.find((elt) => elt.name === name)

  if (!checked) {
    // console.log(`\n!!! check failed  for ${path}!!!`)
    // console.log('elements', elements)
    // console.log('name', name)
    return null
  }

  if (throwDefaults) defaultFilters = []

  //remove accents, spaces ...
  const element = elements.find((elt) => elt.name === name)
  // console.log('name', name)
  // console.log('elemneet', element)

  const cleanString = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '')
      .toLowerCase()

  const exists = (elements, name) =>
    elements.find((element) => cleanString(element.name) === cleanString(name))

  const elementExists = exists(elements, newName)
  const elementId = dependanceValue ? dependanceValue + '_' + name : name
  const newElementId = dependanceValue
    ? dependanceValue + '_' + newName
    : newName

  const disabled =
    isLoadingElements || isSaving || newName === '' || !!elementExists

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

  const errorInput = !!elementExists && !isLoadingElements && !isSaving
  const inputLabel =
    elementExists && !isLoadingElements && !isSaving
      ? `${elementExists.name} existe déjà !`
      : newLabel

  // console.log('\nselect', label)
  // console.log('filters', filters)
  // console.log('name', name)
  // console.log('elementId', elementId)
  // console.log('newFilters', newFilters)
  // console.log(elements.find((elt) => elt.name === name))

  // console.log('elements', elements)

  const addElement = (
    <GridContainer>
      <GridItem xs={8}>
        <TextInput
          label={inputLabel}
          text={newName}
          onChange={setNewName}
          error={errorInput}
        />
      </GridItem>

      <GridItem xs={4}>
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
  )

  const handleChange = (name) => {
    setName(name)
    setThrowDefaults(true)
  }

  let filter
  switch (type) {
    case 'select':
      filter = (
        <GridContainer>
          <GridItem xs={add ? 5 : 12}>
            <Select
              label={label}
              elements={elements}
              selected={name}
              onChange={handleChange}
            />
          </GridItem>
          {add && <GridItem xs={7}>{addElement}</GridItem>}
        </GridContainer>
      )
      break

    case 'list':
      filter = (
        <div>
          {add && addElement}
          <List
            label={label}
            elements={elements}
            selected={name}
            onSelect={handleChange}
            render={render}
            defaultName={defaults ? defaultName : ''}
          />
        </div>
      )

      break

    default:
  }

  // console.log(`\ngoing to render ${path}`)
  // console.log(`elements for ${path}`, elements)
  // console.log('name', name)

  // if (!checked) return null

  return (
    <div>
      {filter}
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
        React.cloneElement(children, {
          ...newFilters,
          id: elementId,
          element,
          defaultFilters: defaults ? defaultFilters.slice(1) : [],
        })}
    </div>
  )
}

export default React.memo(Filter)
