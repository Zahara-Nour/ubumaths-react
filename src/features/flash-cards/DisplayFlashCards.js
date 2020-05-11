import React, { useState } from 'React'

import { useCards } from 'app/hooks'
import { CircularProgress, Container } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import FlashCard from './FlashCard'
import { Redirect } from 'react-router-dom'
import NavBar from 'components/NavBar'
import generateCard from './generateCard'



function DisplayFlashCards({ match }) {
  const theme = match.params.theme
  const subject = match.params.subject
  const domain = match.params.domain
  const level = match.params.level
  const [cards, isLoading, isError] = useCards(subject, domain, theme, level)
  const [card, setCard] = useState(0)
  const [IsFinished, setIsFinished] = useState(false)

  const handleNext = () => {
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

  return (
    <div>
      <NavBar />
      <Container fixed>
      <h2> {match.params.theme}</h2>
      {cards.length > 0 && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={8} lg={6}>
            <FlashCard card={generateCard(cards[card])} onNext={handleNext} />

            <p style={{ color: 'white' }}>.</p>
          </GridItem>
        </GridContainer>
      )}
      </Container>
    </div>
  )
}

export default DisplayFlashCards
