import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SAVE_TYPES,
  saveDb,
  saveSuccess,
  saveFailure,
} from 'features/db/dbSlice'
import { useCollection, useWhyRendered } from 'app/hooks'
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
import { selectUser } from 'features/auth/authSlice'
import { getLogger } from 'app/utils'

function Filter(props) {
  const {
    path,
    label,
    newLabel,
    children,
    filters: filtersProp,
    defaultFilters: defaultFiltersProp,
    filterNameAppended = false,
    filterName,
    type,
    add = false,
    sort,
    render,
    listen = false,
    user,
  } = props

  const { trace, debug } = getLogger(`Filter ${path}`)

  const dispatch = useDispatch()
  const uid = useSelector(selectUser).email
  const [throwDefaults, setThrowDefaults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const emptyArray = useMemo(() => [], [])

  trace(`>>>>> ${path}`)
  // most important : filters to trigger fetching collection and to set default names

  let dependanceName = ''
  let dependanceValue = ''

  if (filtersProp) {
    filtersProp.forEach((filter) => {
      dependanceName = Object.getOwnPropertyNames(filter)[0]
      dependanceValue = dependanceValue
        ? dependanceValue + '_' + filter[dependanceName]
        : filter[dependanceName]
    })
  }

  const newF = filtersProp
    ? user
      ? [{uid}].concat(filtersProp)
      : filtersProp
    : emptyArray

  const filters = useFilters(newF)
  // const filters = useFilters(filtersProp|| emptyArray)

  let defaultFilters = useFilters(defaultFiltersProp || emptyArray)
  const defaults = useMemo(() => defaultFilters && !!defaultFilters.length, [
    defaultFilters,
  ])
  const defaultName = useMemo(() => {
    if (defaults) {
      const filter = defaultFilters[0]
      const name = Object.getOwnPropertyNames(filter)[0]
      return filter[name]
    } else return ''
  }, [defaults, defaultFilters])

  const dependance = useMemo(() => [{ [dependanceName]: dependanceValue }], [
    dependanceName,
    dependanceValue,
  ])

  const [elements, isLoadingElements] = useCollection({
    path,
    filters: filterNameAppended ? dependance : filters,
    listen: add || listen,
    sort,
  })

  const [name, setName] = useState('')
  const [newName, setNewName] = useState('')
  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const state = {
    uid,
    throwDefaults,
    name,
    elements,
    isSaving,
    savedError,
    savedSuccess,
  }

  useEffect(() => {
    if (elements && elements.length && !defaults) {
      trace('[useEffect] set name to :', elements[0].name)
      setName(elements[0].name)
    }
  }, [elements, defaults])

  useEffect(() => {
    if (defaults) {
      trace('[useEffect] set name to default:', defaultName)
      setName(defaultName)
      setThrowDefaults(false)
    }
  }, [defaults, defaultName])

  const newFilters = useMemo(() => {
    const newOnes = filters.concat({ [filterName]: name })
    trace('newOnes', [...newOnes])
    if (user) {
    
      newOnes.shift()
      trace('newOnes', [...newOnes])
    }
    return newOnes
  }, [filterName, filters, name, user])

  const checked =
    elements &&
    elements.length &&
    name &&
    elements.find((elt) => elt.name === name)

  useWhyRendered('Filter', props, state)
  trace('  filtersProp', filtersProp)
  trace('  filters', filters)
  trace('  defaultFiltersProp', defaultFiltersProp)
  trace('  defaultFilters', defaultFilters)
  trace('  defaults', defaults)
  trace('  user', true)
  debug('  elements :', elements)
  debug('  name :', name)
  trace('  newFilters', newFilters)
  trace('  throwDefaults', throwDefaults)

  if (!checked) {
    const reason = !elements
      ? '!elements '
      : !elements.length
      ? 'elements empty'
      : !name
      ? 'name undefined'
      : 'name not in elements'

    trace('  check failed :', reason)
    trace(`<<<<< ${path} \n\n`)
    return null
  }

  if (throwDefaults) defaultFilters = emptyArray

  const element = elements.find((elt) => elt.name === name)

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
  const elementId = dependanceValue ? dependanceValue + '_' + name : name
  const newElementId = dependanceValue
    ? dependanceValue + '_' + newName
    : newName

  const disabled =
    isLoadingElements || isSaving || newName === '' || !!elementExists

  trace('  checking ok -> going to render')
  trace('  element', element)
  trace('  elementId', elementId)
  trace('  disbled', disabled)
  trace('  isloading', isLoadingElements)
  trace('  isSaving', isSaving)
  trace('  newName', newName)
  trace('  elemntsExists', !!elementExists)
  trace(`<<<<< ${path}\n\n`)

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
    const document = {
      name: newName,
    }
    if (filterNameAppended && filters.length) {
      document[dependanceName] = dependanceValue
    } else if (filters.length) {
      filters.forEach((filter) => {
        const name = Object.getOwnPropertyNames(filter)[0]
        const value = filter[name]
        document[name] = value
      })
    }
    save(path, document).then(() => {
      setName(newName)
      setNewName('')
    })
  }

  const errorInput = !!elementExists && !isLoadingElements && !isSaving
  const inputLabel = !!elementExists
    ? `${elementExists.name} existe déjà !`
    : newLabel

  const addElement = (
    <GridContainer>
      <GridItem xs={8}>
        <TextInput
          label={inputLabel}
          text={newName}
          onChange={(name) => {
            console.log('onChange name', name)
            setNewName(name)
          }}
          error={errorInput}
        />
      </GridItem>

      <GridItem xs={4}>
        <Button
          disabled={disabled}
          round
          justIcon
          color='rose'
          size='sm'
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
          filters: newFilters,
          id: elementId,
          element,
          defaultFilters: defaults ? defaultFilters.slice(1) : [],
        })}
    </div>
  )
}

export default React.memo(Filter)
