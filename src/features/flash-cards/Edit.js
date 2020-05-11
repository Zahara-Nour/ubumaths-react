import React, { useState, useCallback, useEffect } from 'react'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import CardsList from './CardsList'
import FlashCard from './FlashCard'
import generateCard from './generateCard'
import EditCard from './EditCard'
import { AiOutlineSelect } from 'react-icons/ai'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'
import { useThemes, useSubjects, useDomains, useCards } from 'app/hooks'
import { saveCard } from 'app/db'

import styles from 'assets/jss/views/regularFormsStyle'
import { makeStyles, CircularProgress } from '@material-ui/core'
import SelectSubject from './SelectSubject'
import SelectTheme from './SelectTheme'
import SelectDomain from './SelectDomain'
import emptyCard from './emptyCard'
import SnackbarContent from 'components/Snackbar/SnackbarContent'

const useStyles = makeStyles(styles)

function Edit() {
  const classes = useStyles()
  const [subjects, isLoadingSubjects, isErrorSubjects] = useSubjects()
  const [subject, setSubject] = useState('')
  const [domains, isLoadingDomains, isErrorDomains] = useDomains(subject)
  const [domain, setDomain] = useState('')
  const [themes, isLoadingThemes, isErrorThemes] = useThemes(subject, domain)
  const [theme, setTheme] = useState('')
  const [cards, isLoadingCards, isErrorCards] = useCards({
    subject,
    domain,
    theme,
    listen: true,
  })
  const [card, setCard] = useState(0)
  const [newCard, setNewCard] = useState({ ...emptyCard })
  const [sortedCards, setSortedCards] = useState([])
  const [saveError, setSaveError] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedTitle, setSavedTitle] = useState('')
  

  const save = (c = newCard) => {
    setSaving(true)
    saveCard(c)
      .then(() => {
        setSaving(false)
        setSaveSuccess(true)
        if (
          c.title !== sortedCards[card].title ||
          c.subject !== subject ||
          c.domain !== domain ||
          c.theme !== theme
        ) {
          setSubject(c.subject)
          setDomain(c.domain)
          setTheme(c.theme)
          setSavedTitle(c.title)
        }
      })
      .catch((error) => {
        setSaving(false)
        setSaveError(error)
      })
  }

  useEffect(() => {
    if (savedTitle) {
      setCard(sortedCards.findIndex((card) => card.title === savedTitle))
    }
  }, [savedTitle, sortedCards])

  useEffect(() => {
    let tempCards = []
    cards.forEach((card) => {
      const level = card.level

      if (tempCards[level - 1]) {
        tempCards[level - 1].push(card)
        tempCards[level - 1].sort((a, b) => {
          if (a.title < b.title) return -1
          if (a.title > b.title) return 1
          return 0
        })
      } else {
        tempCards[level - 1] = [card]
      }
    })

    tempCards = tempCards.reduce((prev, current) => prev.concat(current), [])

    setSortedCards(tempCards)
  }, [cards])

  // console.log('newCard', newCard)
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={3} lg={3}>
        <Card>
          <CardHeader color='rose' icon>
            <CardIcon color='rose'>
              <AiOutlineSelect />
            </CardIcon>
          </CardHeader>
          <CardBody>
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
          </CardBody>
        </Card>
      </GridItem>
      {theme && (
        <GridItem xs={12} sm={12} md={3} lg={3}>
          {isLoadingCards ? (
            <CircularProgress />
          ) : (
            <Card>
              <CardHeader color='rose' icon>
                <CardIcon color='rose'>
                  <AiOutlineSelect />
                </CardIcon>
              </CardHeader>
              <CardBody>
                <CardsList
                  cards={sortedCards}
                  cardIndex={card}
                  onSelect={setCard}
                />
              </CardBody>
            </Card>
          )}
        </GridItem>
      )}
      {theme && sortedCards.length > 0 && sortedCards[card] && (
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <EditCard
            card={sortedCards[card]}
            onNewCard={setNewCard}
            onSave={save}
            saving={saving}
          />
          {saveError && (
            <SnackbarContent
              message={"L'enregistement' a échoué ! " + saveError}
              close
              color='danger'
              onClose={() => setSaveError(false)}
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
        </GridItem>
      )}
      {theme && sortedCards.length > 0 && (
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <FlashCard card={generateCard(newCard)} />
        </GridItem>
      )}
    </GridContainer>
  )
}

export default Edit
