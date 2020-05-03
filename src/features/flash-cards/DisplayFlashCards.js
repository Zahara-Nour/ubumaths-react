import React, { useState } from 'React'
import { useCards } from 'app/hooks'
import { CircularProgress } from '@material-ui/core'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import FlashCard from './FlashCard'
import { Redirect } from 'react-router-dom'


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

  console.log('cards', cards)
  console.log('card', card)

 if (isError) return (
    <SnackbarContent
      message={'Les cartes ne se sont pas chargées ! ' + isError}
      close
      color='danger'
      
    />
  )

  if (IsFinished) return <Redirect to='/flash-cards/'/>

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
     <h2> {match.params.theme}</h2>
      {cards.length > 0 && <FlashCard card={cards[card]} onNext={handleNext} />}
      <p/>
    </div>
  )
}

export default DisplayFlashCards
