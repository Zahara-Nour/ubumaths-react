import React, { useState, useEffect, useMemo, useCallback } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Radio from '@material-ui/core/Radio'
import Checkbox from '@material-ui/core/Checkbox'

// @material-ui/icons
import MailOutline from '@material-ui/icons/MailOutline'
import Check from '@material-ui/icons/Check'
import Clear from '@material-ui/icons/Clear'
import Contacts from '@material-ui/icons/Contacts'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'

// core components

import CustomInput from 'components/CustomInput/CustomInput.js'
import Button from 'components/CustomButtons/Button.js'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardText from 'components/Card/CardText.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import styles from 'assets/jss/views/regularFormsStyle'
import SelectGrade from './SelectGrade'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Snackbar from 'components/Snackbar/Snackbar'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import { saveCard } from 'app/db'

const useStyles = makeStyles(styles)

function EditCardFields({ card, onNewCard }) {
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const [enounce, setEnounce] = useState('')
  const [answer, setAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [warning, setWarning] = useState('')
  const [grade, setGrade] = useState('')
  const [level, setLevel] = useState(1)
  const [variables, setVariables] = useState({})
  const [newCard, setNewCard] = useState({
    enounce: '',
    variables: {},
    answer: '',
    explanation: '',
    warning: '',
    theme: '',
    subject: '',
  })

  const handleTitle = (evt) => {
    const value = evt.target.value
    setTitle(value)
    setNewCard({ ...newCard, title: value })
  }
  const handleEnounce = (evt) => {
    const value = evt.target.value
    setEnounce(evt.target.value)
    setNewCard({ ...newCard, enounce: value })
  }
  const handleAnswer = (evt) => {
    const value = evt.target.value
    setAnswer(value)
    setNewCard({ ...newCard, answer: value })
  }
  const handleExplanation = (evt) => {
    const value = evt.target.value
    setExplanation(value)
    setNewCard({ ...newCard, explanation: value })
  }
  const handleWarning = (evt) => {
    const value = evt.target.value
    setWarning(value)
    setNewCard({ ...newCard, warning: value })
  }
  const handleGrade = useCallback((grade) => {
    setNewCard((card) => ({ ...card, grade }))
  }, [])

  const handleLevel = (evt) => {
    const value = evt.target.value
    setLevel(value)
    setNewCard({ ...newCard, level: value })
  }

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

  const handleVariable = (name) => (evt) => {
    const value = evt.target.value
    const newVariables = { ...variables, [name]: value }
    setVariables(newVariables)
    setNewCard((card) => ({ ...card, variables: newVariables }))
  }

  const addVariable = () => {
    setVariables((variables) => ({ ...variables, [`&${getNextId()}`]: '' }))
  }

  const deleteVariable = (name) => {
    const { [name]: tmp, ...rest } = variables
    setVariables({ ...rest })
  }

  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (card) {
      const { variables, ...rest } = card

      // const tempCard = {
      //   enounce: card.enounce,
      //   variables: { ...card.variables },
      //   answer: card.answer,
      //   explanation: card.explanation,
      //   warning: card.warning,
      //   theme: card.theme,
      //   subject: card.subject,
      //   subject: card.subject,
      //   id: card.id,
      // }
      const tempCard = {
        ...rest,
        variables: { ...card.variables },
      }
      setTitle(card.title)
      setEnounce(card.enounce)
      setAnswer(card.answer)
      setExplanation(card.explanation)
      setWarning(card.warning)
      setVariables({ ...card.variables })
      setNewCard(tempCard)
    }
  }, [card])

  useEffect(() => {
    onNewCard(newCard)
  }, [newCard, onNewCard])

  console.log('variables', variables)

  return card ? (
    <Card>
      {saveError && (
        <SnackbarContent
          message={"L'enregistement' a échoué ! " + saveError}
          close
          color='danger'
          onClose={() => setSaveError('')}
        />
      )}
      {saveSuccess && (
        <SnackbarContent
          message={"L'enregistement' a réussi ! "}
          close
          color='success'
          onClose={() => setSaveSuccess(false)}
        />
      )}
      <CardHeader color='rose' icon>
        <CardIcon color='rose'>
          <EditIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        <form>
          <CustomInput
            labelText='Titre'
            id='card-title'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              value: title,
              onChange: handleTitle,
            }}
          />
          <CustomInput
            labelText='Enoncé'
            id='card-enounce'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              value: enounce || '', // to ensure input being considered as a controlled component
              onChange: handleEnounce,
              multiline: true,
            }}
          />
          <CustomInput
            labelText='Réponse'
            id='card-answer'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              value: answer || '', // to ensure input being considered as a controlled component
              onChange: handleAnswer,
            }}
          />
          <CustomInput
            labelText='Explication'
            id='card-explanation'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              value: explanation || '', // to ensure input being considered as a controlled component
              onChange: handleExplanation,
              multiline: true,
            }}
          />
          <CustomInput
            labelText='Avertissement'
            id='card-warning'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              value: warning || '', // to ensure input being considered as a controlled component
              onChange: handleWarning,
              multiline: true,
            }}
          />
          <SelectGrade onChange={handleGrade} />
          <CustomInput
            labelText='Niveau'
            id='card-level'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'number',
              value: level || '', // to ensure input being considered as a controlled component
              onChange: handleLevel,
            }}
          />

          <div>
            variables
            <Button size='sm' color='success' onClick={addVariable}>
              +
            </Button>
          </div>
          {Object.getOwnPropertyNames(variables).map((name) => (
            <GridContainer key={name} alignItems='center'>
              <GridItem xs={3}>{name}</GridItem>
              <GridItem xs={6}>
                <CustomInput
                  labelText='value'
                  id={`variable-${name}`}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: 'text',
                    value: variables[name],
                    onChange: handleVariable(name),
                  }}
                />
              </GridItem>
              <GridItem xs={3}>
                <Button justIcon onClick={() => deleteVariable(name)}>
                  <DeleteIcon />
                </Button>
              </GridItem>
            </GridContainer>
          ))}

          <Button
          disabled={saving}
            color='rose'
            onClick={() => {
              setSaving(true)
              saveCard(newCard)
                .then(() => {
                  setSaving(false)
                  setSaveSuccess(true)
                })
                .catch((error) => {
                  setSaving(false)
                  setSaveError(error)
                })
            }}
          >
            Enregistrer
          </Button>
        </form>
      </CardBody>
    </Card>
  ) : null
}

export default EditCardFields
