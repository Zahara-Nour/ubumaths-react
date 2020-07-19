import React, { useState, useMemo, useEffect, useRef } from 'react'
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
import List from './List'
import { selectUser } from 'features/auth/authSlice'
import { getLogger, emptyArray } from 'app/utils'

function Filter({
  path, // path to database
  label, //  filter label
  newLabel, // lbel for new filter creationk
  children, // children to diplsay after filter has been set
  filters = emptyArray, //
  defaultFilters,
  filterName, // field name in documents collection
  type = 'select', // 'list' or 'select'
  add, //  set the  ability to create a new fiter name
  sort, // function to sort documents list
  render, //
  listen, // add a listener on the collection
  user, //
  newElement,
}: props) {
  const { trace, debug } = getLogger(`Filter ${path}`)

  const dispatch = useDispatch()
  const uid = useSelector(selectUser).email
  const [throwDefaults, setThrowDefaults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  trace(`>>>>> ${path}`)

  // Grab elements to display
  // filters is added uid if user is logged in
  const [elements, isLoadingElements] = useCollection({
    path,
    filters: user ? [{ uid }].concat(filters) : filters,
    listen: add || listen,
    sort,
  })

  // Check and set defaults
  const defaults = defaultFilters && defaultFilters.length && !throwDefaults

  let defaultName = ''
  if (defaults) {
    const filter = defaultFilters[0]
    const name = Object.getOwnPropertyNames(filter)[0]
    defaultName = filter[name]
  }

  const [name, setName] = useState('')
  const [newName, setNewName] = useState()
  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [displayNew, setDisplayNew] = useState(false)
  const newRef = useRef()
  // const state = {
  //   uid,
  //   throwDefaults,
  //   name,
  //   elements,
  //   isSaving,
  //   savedError,
  //   savedSuccess,
  // }

  useEffect(() => {
    if (displayNew && newRef.current) newRef.current.focus()
  }, [displayNew])

  useEffect(() => {
    setDisplayNew(elements && elements.length === 0)
  }, [elements])

  useEffect(() => {
    if ((!elements || !elements.length) && newElement) {
      setNewName(newElement.name)
    } else {
      setNewName()
    }
  }, [newElement, elements, type])

  // set element name to display
  useEffect(() => {
    if (defaults) {
      trace('[**] set name to default:', defaultName)
      setName(defaultName)
      setThrowDefaults(false)
    } else if (elements && elements.length) {
      trace('[**] set name to :', elements[0].name)
      setName(elements[0].name)
    } else {
      setName('')
    }
  }, [elements, defaults, defaultName, trace])

  const newFilters = filters.concat({ [filterName]: name })
  const filtersString = newFilters.reduce((acc, filter) => {
    const name = Object.getOwnPropertyNames(filter)[0]
    const value = filter[name]
    return acc ? acc + '_' + value : value
  }, '')

  // Check if the component must be displayed
  const checkedForDisplay =
    elements &&
    (elements.find((elt) => elt.name === name) || newName || newName === '')

  // useWhyRendered('Filter', props, state)
  // trace('  filters', filters)
  // trace('  defaultFilters', defaultFilters)
  // trace('  defaults', defaults)
  // // trace('  user', true)
  // debug('  elements :', elements)
  // debug('  name :', name)
  // trace('  newFilters', newFilters)
  // trace('  throwDefaults', throwDefaults)

  if (!checkedForDisplay) {
    // const reason = !elements
    //   ? '!elements '
    //   : !elements.length
    //   ? 'elements empty'
    //   : !name
    //   ? 'name undefined'
    //   : 'name not in elements'

    // trace('  check failed :', reason)
    // trace(`<<<<< ${path} \n\n`)
    return null
  }

  const element = elements && elements.find((elt) => elt.name === name)

  //remove accents, spaces ...
  const cleanString = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '')
      .toLowerCase()

  let elementExists
  let existedElement

  if (elements && newName) {
    existedElement = elements.find(
      (element) => cleanString(element.name) === cleanString(newName),
    )
    elementExists = !!existedElement
  }

  const disabled =
    isLoadingElements || isSaving || (displayNew && !newName) || elementExists

  // trace('  checking ok -> going to render')
  // trace('  element', element)
  // trace('  disabled', disabled)
  // trace('  isloading', isLoadingElements)
  // trace('  isSaving', isSaving)
  // trace('  newName', newName)
  // trace('  elemntsExists', !!elementExists)
  // trace(`<<<<< ${path}\n\n`)

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
        setDisplayNew(false)
      })
      .catch((error) => {
        setIsSaving(false)
        setSavedError(true)
        dispatch(saveFailure({ type, key }))
        setDisplayNew(false)
      })
  }

  const saveNewElement = () => {
    const document = { ...newElement, name: newName }

    filters.forEach((filter) => {
      const name = Object.getOwnPropertyNames(filter)[0]
      const value = filter[name]
      document[name] = value
    })

    save(path, document).then(() => {
      setName(newName)
      setNewName('')
    })
  }

  const handleClickNew = () => {
    if (displayNew) {
      saveNewElement()
    } else {
      setDisplayNew(true)
    }
  }

  const errorInput = elementExists && !isLoadingElements && !isSaving
  const inputLabel = elementExists
    ? `${existedElement.name} existe déjà !`
    : newLabel

  const addElement = (
    <>
      {displayNew && (
        <GridItem xs={elements.length > 0 ? 5 : 10}>
          <TextInput
            ref={newRef}
            label={inputLabel}
            text={newName}
            onChange={(name) => {
              setNewName(name)
            }}
            error={errorInput}
          />
        </GridItem>
      )}

      <GridItem>
        <Button
          disabled={disabled}
          round
          justIcon
          color='rose'
          size='sm'
          onClick={handleClickNew}
        >
          <AddIcon />
        </Button>
      </GridItem>
    </>
  )

  const handleChange = (name) => {
    setName(name)
    setThrowDefaults(true)
  }

  let filter
  const attributes = {
    label,
    elements,
    selected: name,
    onChange: handleChange,
  }
  switch (type) {
    case 'select':
      filter = (
        <GridContainer alignItems='center'>
          {elements.length > 0 && (
            <GridItem xs={add ? (displayNew ? 5 : 10) : 12}>
              <Select {...attributes} onChange={handleChange} />
            </GridItem>
          )}
          {add && addElement}
        </GridContainer>
      )
      break

    case 'list':
      filter = (
        <>
          <GridContainer alignItems='center'>{add && addElement}</GridContainer>
          <List
            {...attributes}
            onSelect={handleChange}
            render={render}
            defaultName={defaults ? defaultName : ''}
          />
        </>
      )

      break

    default:
  }

  return (
    <div id={'filter ' + path}>
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
          filtersString,
          element,
          defaultFilters: defaults ? defaultFilters.slice(1) : [],
        })}
    </div>
  )
}

export default React.memo(Filter)
