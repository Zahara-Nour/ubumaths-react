import React, { useState, useEffect, useRef, useCallback } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import { math } from 'tinycas/build/math/math'

// core components

import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import EditIcon from '@material-ui/icons/Edit'

import styles from 'assets/jss/views/regularFormsStyle'

import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'

import { useCollection } from 'app/hooks'
import emptyCard from '../../flash-cards/emptyCard'
import TextInput from 'components/TextInput'
import NumberInput from 'components/NumberInput'
import EditVariables from './EditVariables'
import EditButtons from './EditButtons'
import { CircularProgress, FormControlLabel } from '@material-ui/core'
import Select from 'components/Select'
import Filter from 'components/Filter'
import { compareArrays } from 'app/utils'
import { useSelector } from 'react-redux'
import { selectIsAdmin, selectUser } from 'features/auth/authSlice'
import SwitchUI from '@material-ui/core/Switch'
import { DropzoneArea } from 'material-ui-dropzone'
import { storage } from 'features/db/db'
import ImageUpload from 'components/CustomUpload/ImageUpload'

const useStyles = makeStyles(styles)

function EditCard({
  card = emptyCard,
  onNewCard,
  onGeneratedCard,
  onSave,
  saving,
}) {
  const classes = useStyles()
  const isAdmin = useSelector(selectIsAdmin)
  const uid = useSelector(selectUser).email
  const [title, setTitle] = useState('')
  const [defaultTitle, setDefaultTitle] = useState('')
  const [enounce, setEnounce] = useState('')
  const [defaultEnounce, setDefaultEnounce] = useState('')
  const [answer, setAnswer] = useState('')
  const [defaultAnswer, setDefaultAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [defaultExplanation, setDefaultExplanation] = useState('')
  const [warning, setWarning] = useState('')
  const [defaultWarning, setDefaultWarning] = useState('')
  const [grades, isLoadingGrades] = useCollection({
    path: 'Grades',
  })
  const [grade, setGrade] = useState('')
  const [level, setLevel] = useState(1)
  const [variables, setVariables] = useState({})
  const [generatedVariables, setGeneratedVariables] = useState({})
  const [newCard, setNewCard] = useState({ ...emptyCard })
  const [generatedCard, setGeneratedCard] = useState({ ...emptyCard })
  const [advanced, setAdvanced] = useState(isAdmin ? true : false)
  const [defaultImgName, setDefaultImgName] = useState('')
  const [imgName, setImgName] = useState('')
  const [imgFile, setImgFile] = useState()
  const [imgUploaded, setImgUploaded] = useState(false)

  const [defaultFilters, setDefaultFilters] = useState([])
  const defaultFiltersRef = useRef([])

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    console.log('file', file.name)
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      // setImgData(reader.result)
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const getIdVariables = () =>
    Object.getOwnPropertyNames(variables)
      .map((name) => name.substring(1))
      .map((name) => parseInt(name, 10))

  const getNextId = () => {
    for (let i = 1; i < 10; i++) {
      if (!getIdVariables().includes(i)) return i
    }
    throw new Error('too much variables')
  }

  const editVariable = (name) => (value) => {
    setVariables({ ...variables, [name]: value })
    setGeneratedVariables({
      ...variables,
      [name]: value ? math(value).generate().latex : '',
    })
  }

  const addVariable = () => {
    const nextId = getNextId()
    setVariables((variables) => ({ ...variables, [`&${nextId}`]: '' }))
    setGeneratedVariables((variables) => ({ ...variables, [`&${nextId}`]: '' }))
  }

  const deleteVariable = (name) => () => {
    const { [name]: tmp, ...rest } = variables
    setVariables({ ...rest })
    const { [name]: tmp2, ...rest2 } = generatedVariables
    setGeneratedVariables({ ...rest2 })
  }

  const createCard = () => {
    onSave(
      'FlashCards',
      isAdmin
        ? {
            ...emptyCard,
            subject: newCard.subject,
            domain: newCard.domain,
            theme: newCard.theme,
          }
        : {
            ...emptyCard,
            subject: newCard.subject,
            theme: newCard.theme,
            name: 'Nouvelle carte',
            uid,
          },
    )
  }

  const duplicateCard = () => {
    const name = newCard.name + ' (copie)'
    const { id, ...rest } = isAdmin ? newCard : { ...newCard, uid }
    onSave('FlashCards', {
      ...rest,
      name,
    })
  }

  useEffect(() => {
    if (card) {
      setNewCard((c) => ({ ...c, id: card.id }))
      setTitle(card.name || '')
      setDefaultTitle(card.name || '')
      setEnounce(card.enounce || '')
      setDefaultEnounce(card.enounce || '')
      setAnswer(card.answer || '')
      setDefaultAnswer(card.answer || '')
      setExplanation(card.explanation || '')
      setDefaultExplanation(card.explanation || '')
      setWarning(card.warning || '')
      setDefaultWarning(card.warning || '')
      setVariables({ ...card.variables })
      const generated = {}

      Object.getOwnPropertyNames(card.variables).forEach((name) => {
        generated[name] = math(card.variables[name]).generate().latex
      })
      // console.log('generated variables', generated)
      setGeneratedVariables(generated)
      setGrade(card.grade || '')
      setLevel(card.level || '')

      setDefaultFilters(
        isAdmin
          ? [
              { subject: card.subject },
              { domain: card.domain },
              { theme: card.theme },
            ]
          : [{ subject: card.subject }, { theme: card.theme }],
      )
    }
  }, [card, isAdmin])

  useEffect(() => {
    setNewCard((card) => ({
      ...card,
      name: title,
      enounce,
      answer,
      explanation,
      warning,
      grade,
      level,
      variables,
      image: 'flashcards-img/' + (imgName || defaultImgName),
    }))
  }, [
    title,
    enounce,
    answer,
    explanation,
    warning,
    grade,
    level,
    variables,
    imgName,
    defaultImgName,
  ])

  useEffect(() => {
    setGeneratedCard((card) => {
      return {
        ...card,
        name: title,
        enounce,
        answer,
        explanation,
        warning,
        level,
        variables: generatedVariables,
        image: imgUploaded ? 'flashcards-img/' + (imgName || defaultImgName) : ''
      }
    })
  }, [
    title,
    enounce,
    answer,
    explanation,
    warning,
    level,
    generatedVariables,
    imgName,
    defaultImgName,
    imgUploaded
  ])

  useEffect(() => {
    onNewCard(newCard)
  }, [newCard, onNewCard])

  useEffect(() => {
    onGeneratedCard(generatedCard)
  }, [generatedCard, onGeneratedCard])

  const filters = isAdmin ? (
    <Filter
      type='select'
      path='Subjects'
      label='Matière'
      filterName='subject'
      defaultFilters={defaultFilters}
    >
      <Filter
        type='select'
        path='Domains'
        label='Domaine'
        filterName='domain'
        filterNameAppended
      >
        <Filter
          type='select'
          path='Themes'
          label='Thème'
          filterName='theme'
          filterNameAppended
        >
          <GetFilters />
        </Filter>
      </Filter>
    </Filter>
  ) : (
    <Filter
      type='select'
      path='Subjects'
      label='Matière'
      filterName='subject'
      defaultFilters={defaultFilters}
    >
      <Filter type='select' path='Themes' label='Thème' filterName='theme' user>
        <GetFilters />
      </Filter>
    </Filter>
  )

  function GetFilters({ id }) {
    if (isAdmin) {
      const [subject, domain, theme] = id.split('_')
      if (!compareArrays([subject, domain, theme], defaultFiltersRef.current)) {
        setNewCard((card) => ({ ...card, subject, domain, theme }))
        setGeneratedCard((card) => ({ ...card, subject, domain, theme }))
      }
      defaultFiltersRef.current = [subject, domain, theme]
    } else {
      const [subject, theme] = id.split('_')
      if (!compareArrays([subject, theme], defaultFiltersRef.current)) {
        setNewCard((card) => ({ ...card, subject, theme }))
        setGeneratedCard((card) => ({ ...card, subject, theme }))
      }
      defaultFiltersRef.current = [subject, theme]
    }
    return null
  }

  if (!card) return null

  return (
    <Card>
      <CardHeader color='rose' icon>
        <CardIcon color='rose'>
          <EditIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        {!isAdmin && (
          <FormControlLabel
            control={
              <SwitchUI
                checked={advanced}
                onChange={(event) => setAdvanced(event.target.checked)}
                classes={{
                  switchBase: classes.switchBase,
                  checked: classes.switchChecked,
                  thumb: classes.switchIcon,
                  track: classes.switchBar,
                }}
              />
            }
            classes={{
              label: classes.label,
            }}
            label='Paramètres avancés'
          />
        )}
        <TextInput
          label='Titre'
          defaultText={defaultTitle}
          onChange={setTitle}
          throttle={500}
        />
        <TextInput
          label='Enoncé'
          defaultText={defaultEnounce}
          onChange={setEnounce}
          multiline
          throttle={500}
        />
        <TextInput
          label='Réponse'
          defaultText={defaultAnswer}
          onChange={setAnswer}
          multiline
          throttle={500}
        />
        {advanced && (
          <TextInput
            label='Explication'
            defaultText={defaultExplanation}
            onChange={setExplanation}
            multiline
            throttle={500}
          />
        )}
        {advanced && (
          <TextInput
            label='Avertissement'
            defaultText={defaultWarning}
            onChange={setWarning}
            multiline
            throttle={500}
          />
        )}

        {advanced && (
          <TextInput
            label='image'
            defaultText={defaultImgName}
            onChange={setImgName}
            throttle={500}
          />
        )}

        {advanced && (
          <DropzoneArea
            filesLimit={1}
            acceptedFiles={['image/*']}
            dropzoneText={'Drag and drop an image here or click'}
            onChange={(files) => {
              if (files && files.length) {
                setDefaultImgName(files[0].name)
                setImgName(files[0].name)
                setImgFile(files[0])
                setImgUploaded(false)
              }
            }}
            onDelete={(file) => {
              setImgName('')
              setDefaultImgName('')
              setImgUploaded(false)
            }}
          />
        )}

        {isAdmin && (
          <GridContainer alignItems='center'>
            <GridItem xs={6}>
              {isLoadingGrades ? (
                <CircularProgress />
              ) : (
                <Select
                  elements={grades}
                  selected={grade}
                  onChange={setGrade}
                />
              )}
            </GridItem>
            <GridItem xs={6}>
              <NumberInput label='Niveau' value={level} onChange={setLevel} />
            </GridItem>
          </GridContainer>
        )}
        {filters}

        {/* <Select
          label={'Matière'}
          elements={subjects}
          selected={subject}
          onChange={setSubject}
        />

        <Select
          label={'Domaine'}
          elements={domains}
          selected={domain}
          onChange={setDomain}
        />

        <Select
          label={'Theme'}
          elements={themes}
          selected={theme}
          onChange={setTheme}
        /> */}

        <br />
        {advanced && (
          <EditVariables
            variables={variables}
            onAdd={addVariable}
            onDelete={deleteVariable}
            onChange={editVariable}
          />
        )}

        <EditButtons
          onNew={createCard}
          onDuplicate={duplicateCard}
          onSave={() => {
            if (imgName && imgFile && !imgUploaded) {
              const imgRef = storage.child(newCard.image)
              imgRef
                .put(imgFile)
                .then(function (snapshot) {
                  console.log('Uploaded a blob or file!')
                  setImgUploaded(true)
                  onSave()
                })
                .catch((error) =>
                  console.log('error while saving image :', error.message),
                )
            } else {
              onSave()
            }
          }}
          saving={saving}
        />
      </CardBody>
    </Card>
  )
}

export default EditCard
