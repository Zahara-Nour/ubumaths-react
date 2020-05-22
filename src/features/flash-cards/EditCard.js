import React, { useState, useEffect, useCallback } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components

import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'
import EditIcon from '@material-ui/icons/Edit'

import styles from 'assets/jss/views/regularFormsStyle'
import SelectGrade from './SelectGrade'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'

import { useGrades, useSubjects, useDomains, useThemes } from 'app/hooks'
import emptyCard from './emptyCard'
import TextInput from '../../components/TextInput'
import NumberInput from '../../components/NumberInput'
import EditVariables from './EditVariables'
import EditButtons from './EditButtons'
import { CircularProgress } from '@material-ui/core'
import SelectSubject from './SelectSubject'
import SelectDomain from './SelectDomain'
import SelectTheme from './SelectTheme'

const useStyles = makeStyles(styles)

function EditCard({ card, onNewCard, onSave, saving }) {
  const classes = useStyles()
  const [subjects, isLoadingSubjects, isErrorSubjects] = useSubjects()
  const [subject, setSubject] = useState(card.subject)
  const [domains, isLoadingDomains, isErrorDomains] = useDomains(subject)
  const [domain, setDomain] = useState(card.domain)
  const [themes, isLoadingThemes, isErrorThemes] = useThemes(subject, domain)
  const [theme, setTheme] = useState(card.theme)
  const [title, setTitle] = useState('')
  const [enounce, setEnounce] = useState('')
  const [answer, setAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [warning, setWarning] = useState('')
  const [grades, isLoadingGrades, isErrorGrades] = useGrades()
  const [grade, setGrade] = useState('')
  const [level, setLevel] = useState(1)
  const [variables, setVariables] = useState({})
  const [newCard, setNewCard] = useState({ ...emptyCard})

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

  const editVariable = (name) => (value) =>
    setVariables({ ...variables, [name]: value })

  const addVariable = () =>
    setVariables((variables) => ({ ...variables, [`&${getNextId()}`]: '' }))

  const deleteVariable = (name) => () => {
    const { [name]: tmp, ...rest } = variables
    setVariables({ ...rest })
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
    const title = newCard.title + ' (copie)'
    const { id, ...rest } = newCard
    onSave({
      ...rest,
      title,
    })
  }

  useEffect(() => {
    if (card) {
      setNewCard(c => ({...c, id:card.id}))
      setTitle(card.title || '')
      setEnounce(card.enounce || '')
      setAnswer(card.answer || '')
      setExplanation(card.explanation || '')
      setWarning(card.warning || '')
      setVariables({ ...card.variables })
      setGrade(card.grade || '')
      setLevel(card.level || '')
      setSubject(card.subject || '')
      setDomain(card.domain || '')
      setTheme(card.theme || '')
    }
  }, [card])

  useEffect(() => {
    setNewCard((card) => ({
      ...card,
      title,
      enounce,
      answer,
      explanation,
      warning,
      grade,
      level,
      variables,
      subject,
      domain,
      theme,
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
    subject,
    domain,
    theme,
  ])

  useEffect(() => {
  
    onNewCard(newCard)
  }, [newCard, onNewCard])

  if (!card) return null

  return (
    <Card>
      <CardHeader color='rose' icon>
        <CardIcon color='rose'>
          <EditIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        <TextInput label='Titre' text={title} onChange={setTitle} />
        <TextInput label='Enoncé' text={enounce} onChange={setEnounce} />
        <TextInput label='Réponse' text={answer} onChange={setAnswer} />
        <TextInput
          label='Explication'
          text={explanation}
          onChange={setExplanation}
        />
        <TextInput
          label='Avertissement'
          text={warning}
          onChange={setWarning}
        />

        <GridContainer alignItems='center'>
          <GridItem xs={6}>
            {isLoadingGrades ? (
              <CircularProgress />
            ) : (
              <SelectGrade grades={grades} grade={grade} onChange={setGrade} />
            )}
          </GridItem>
          <GridItem xs={6}>
            <NumberInput label='Niveau' value={level} onChange={setLevel} />
          </GridItem>
        </GridContainer>

        {isLoadingSubjects ? (
          <CircularProgress />
        ) : (
          <SelectSubject
            subjects={subjects}
            subject={subject}
            onChange={setSubject}
          />
        )}
        {subjects.length > 0 && isLoadingDomains ? (
          <CircularProgress />
        ) : (
          <SelectDomain
            domains={domains}
            domain={domain}
            onChange={setDomain}
          />
        )}
        {domains.length > 0 && isLoadingThemes ? (
          <CircularProgress />
        ) : (
          <SelectTheme themes={themes} theme={theme} onChange={setTheme} />
        )}

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
