import React, { useState } from 'React'
import { math } from 'tinycas/build/math/math'
import { useCards } from 'app/hooks'
import { CircularProgress } from '@material-ui/core'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import FlashCard from './FlashCard'
import { Redirect } from 'react-router-dom'

function generateCard(card) {
  // firestore returns objects with read-only properties

  let tempCard = {
    enounce: card.enounce,
    variables: {},
    answer: card.answer,
    explanation: card.explanation,
    warning: card.warning,
    theme: card.theme,
    subject: card.subject,
  }

  Object.getOwnPropertyNames(card.variables).forEach((variable) => {
    tempCard.variables[variable] = math(
      card.variables[variable],
    ).generate().string
    tempCard.enounce = tempCard.enounce.replace(
      variable,
      '$$$$' + tempCard.variables[variable] + '$$$$',
    )

    tempCard.answer = tempCard.answer.replace(
      variable,
      tempCard.variables[variable],
    )
    if (tempCard.explanation) {
      tempCard.explanation = tempCard.explanation.replace(
        variable,
        '$$$$' + tempCard.variables[variable] + '$$$$',
      )
    }
  })
  console.log(tempCard)
  tempCard.answer = '$$' + math(tempCard.answer).generate().string + '$$'
  tempCard.enounce = tempCard.enounce.replace(/\*\*(.*?)\*\*/g, '$$$$$1$$$$')
  if (tempCard.explanation) {
    tempCard.explanation = tempCard.explanation.replace(
      /\*\*(.*?)\*\*/g,
      '$$$$$1$$$$',
    )
  }
  return tempCard
}

function DisplayFlashCards({ match }) {
  const theme = match.params.theme
  const subject = match.params.subject
  const [cards, isLoading, isError] = useCards(subject, theme)
  const [card, setCard] = useState(0)
  const [IsFinished, setIsFinished] = useState(false)

  const handleNext = () => {
    console.log('next')
    if (card < cards.length - 1) {
      setCard((c) => c + 1)
    } else {
      setIsFinished(true)
    }
  }

  if (isError)
    return (
      <SnackbarContent
        message={'Les cartes ne se sont pas chargées ! ' + isError}
        close
        color='danger'
      />
    )

  if (IsFinished) return <Redirect to='/flash-cards/' />

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      <h2> {match.params.theme}</h2>
      {cards.length > 0 && (
        <FlashCard card={generateCard(cards[card])} onNext={handleNext} />
      )}
      <p />
      <p style={{ color: 'white' }}>.</p>
    </div>
  )
}

export default DisplayFlashCards
