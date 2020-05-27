import React, { useState, useEffect, useRef } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import { math } from 'tinycas/build/math/math'

// core components

import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'
import EditIcon from '@material-ui/icons/Edit'

import styles from 'assets/jss/views/regularFormsStyle'

import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'

import { useCollection } from 'app/hooks'
import emptyCard from './emptyCard'
import TextInput from '../../components/TextInput'
import NumberInput from '../../components/NumberInput'
import EditVariables from './EditVariables'
import EditButtons from './EditButtons'
import { CircularProgress } from '@material-ui/core'
import Select from 'components/Select'
import Filter from 'components/Filter'
import { compareArrays } from 'app/utils'

const useStyles = makeStyles(styles)

function EditCard({
  card = emptyCard,
  onNewCard,
  onGeneratedCard,
  onSave,
  saving,
}) {
  const classes = useStyles()
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

  const [defaultFilters, setDefaultFilters] = useState([])
  const defaultFiltersRef = useRef([])

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
    onSave({
      ...emptyCard,
      subject: newCard.subject,
      domain: newCard.domain,
      theme: newCard.theme,
    })
  }

  const duplicateCard = () => {
    const name = newCard.name + ' (copie)'
    const { id, ...rest } = newCard
    onSave({
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

      setDefaultFilters([
        { subject: card.subject },
        { domain: card.domain },
        { theme: card.theme },
      ])
    }
  }, [card])

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
    }))
  }, [title, enounce, answer, explanation, warning, grade, level, variables])

  useEffect(() => {
    setGeneratedCard((card) => {
      return {
        ...card,
        name: title,
        enounce,
        answer,
        explanation,
        warning,
        grade,
        level,
        variables: generatedVariables,
      }
    })
  }, [
    title,
    enounce,
    answer,
    explanation,
    warning,
    grade,
    level,
    generatedVariables,
  ])

  useEffect(() => {
    onNewCard(newCard)
  }, [newCard, onNewCard])

  useEffect(() => {
    onGeneratedCard(generatedCard)
  }, [generatedCard, onGeneratedCard])

  function GetFilters({ id }) {
    const [subject, domain, theme] = id.split('_')
    if (!compareArrays([subject, domain, theme], defaultFiltersRef.current)) {
      setNewCard((card) => ({ ...card, subject, domain, theme }))
      setGeneratedCard((card) => ({ ...card, subject, domain, theme }))
    }
    defaultFiltersRef.current = [subject, domain, theme]
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
        <TextInput
          label='Explication'
          defaultText={defaultExplanation}
          onChange={setExplanation}
          multiline
          throttle={500}
        />
        <TextInput
          label='Avertissement'
          defaultText={defaultWarning}
          onChange={setWarning}
          multiline
          throttle={500}
        />

        <GridContainer alignItems='center'>
          <GridItem xs={6}>
            {isLoadingGrades ? (
              <CircularProgress />
            ) : (
              <Select elements={grades} selected={grade} onChange={setGrade} />
            )}
          </GridItem>
          <GridItem xs={6}>
            <NumberInput label='Niveau' value={level} onChange={setLevel} />
          </GridItem>
        </GridContainer>

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
        <EditVariables
          variables={variables}
          onAdd={addVariable}
          onDelete={deleteVariable}
          onChange={editVariable}
        />

        <EditButtons
          onNew={createCard}
          onDuplicate={duplicateCard}
          onSave={onSave}
          saving={saving}
        />
      </CardBody>
    </Card>
  )
}

export default EditCard
