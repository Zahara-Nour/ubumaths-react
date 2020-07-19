import React, { useState, useEffect } from 'React'

import {  useCollection } from 'app/hooks'
import { Container } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import FlashCard from './FlashCard'
import { Redirect } from 'react-router-dom'
import NavBar from 'components/NavBar'
import generateCard from './generateCard'
import { shuffle } from 'app/utils'
import queryString from 'query-string'

function DisplayFlashCards({ match, location }) {
  const theme = match.params.theme
  const subject = match.params.subject
  const domain = match.params.domain
  const level = match.params.level
  const [cards, , isError] = useCollection({
    path: 'FlashCards',
    filters: [{ subject }, { domain }, { theme }, {level}],
  })


  // const [cards, , isError] = useCards({subject, domain, theme, level})
  const [card, setCard] = useState(0)
  const [IsFinished, setIsFinished] = useState(false)
  const [shuffledCards, setShuffleCards] = useState([])

  const grade = queryString.parse(location.search).grade

  const handleNext = () => {
    if (card < cards.length - 1) {
      setCard((c) => c + 1)
    } else {
      setIsFinished(true)
    }
  }

  useEffect(() => {
    if (cards) setShuffleCards(shuffle([...cards]))
  }, [cards])


  if (isError)
    return (
      <SnackbarContent
        message={'Les cartes ne se sont pas chargées ! ' + isError}
        close
        color='danger'
      />
    )

  if (IsFinished) return <Redirect to={`/flash-cards/${subject}/${domain}?grade=${grade}`} />

  if (!cards) return null

  return (
    <div>
      <NavBar />
      <Container fixed>
        <h2> {match.params.theme}</h2>
        {cards.length > 0 && (
          <GridContainer>
            <GridItem xs={12} sm={12} md={8} lg={6}>
              <FlashCard
                card={generateCard(shuffledCards[card])}
                onNext={handleNext}
                isLast={card === cards.length - 1}
              />

              <p style={{ color: 'white' }}>.</p>
              <p style={{ color: 'white' }}>.</p>
              <p style={{ color: 'white' }}>.</p>
            </GridItem>
          </GridContainer>
        )}
      </Container>
    </div>
  )
}

export default DisplayFlashCards
