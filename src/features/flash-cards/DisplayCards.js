import React, { useState, useEffect, useCallback, useRef } from 'React'

import { useCollection, usePrevious } from 'app/hooks'
import { Container } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import FlashCard from './FlashCard'
import { Redirect } from 'react-router-dom'
import NavBar from 'components/NavBar'
import generateCard from './generateCard'
import { shuffle, getLogger, dataURItoBlob } from 'app/utils'
import queryString from 'query-string'
import { storage } from 'features/db/db'
import { usePromise } from 'react-use'

function DisplayFlashCards({ match, location }) {
  const { trace, error } = getLogger('DisplayFlashCards', 'trace')
  const mounted = usePromise()
  const theme = match.params.theme
  const subject = match.params.subject
  const domain = match.params.domain
  const level = match.params.level
  const [cards, , isError] = useCollection({
    path: 'FlashCards',
    filters: [{ subject }, { domain }, { theme }, { level }],
  })

  // const [cards, , isError] = useCards({subject, domain, theme, level})
  const [card, setCard] = useState(0)
  const [
    promiseForNextImageLocalUrl,
    setPromiseForNextImageLocalUrl,
  ] = useState()
  const promiseForImageLocalUrl = usePrevious(promiseForNextImageLocalUrl)
  const [localUrlForNextImageAnswer, setLocalUrlForNextImageAnswer] = useState()
  const promiseForImageAnswerLocalUrl = usePrevious(localUrlForNextImageAnswer)
  const [image0, setImage0] = useState()
  const [imageAnswer0, setImageAnswer0] = useState()

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

  const getLocalUrl = useCallback(
    (imgPath) => {
      trace('fetching image :', imgPath)
      // const data = localStorage.getItem(imgPath)
      const data = null
      if (data) {
        trace('image found in store : ', data)
        const blob = dataURItoBlob(data)
        const url = URL.createObjectURL(blob)
        return Promise.resolve(url)
      } else {
        return storage
          .child(imgPath)
          .getDownloadURL()
          .then((url) => {
            trace('url dowloadeed', url)
            const promise = new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest()
              xhr.responseType = 'blob'
              xhr.onload = () => {
                trace('img dowloadeed')
                const blob = xhr.response
                const localUrl = URL.createObjectURL(blob)

                resolve(localUrl)
              }
              xhr.onerror = () => {
                reject()
              }
              xhr.open('GET', url)
              xhr.send()
            })
            return promise
          })
          .catch((err) => error('error while fetching image :', err.message))
      }
    },
    [error, trace],
  )

  useEffect(() => {
    async function getImages() {
      const nextImagePath = shuffledCards[card + 1].image
      if (nextImagePath) {
        setPromiseForNextImageLocalUrl(getLocalUrl(nextImagePath))
      } else {
        setPromiseForNextImageLocalUrl(null)
      }

      const nextImageAnswerPath = shuffledCards[card + 1].imageAnswer
      if (nextImageAnswerPath) {
        setLocalUrlForNextImageAnswer(getLocalUrl(nextImageAnswerPath))
      } else {
        setLocalUrlForNextImageAnswer(null)
      }
    }
    if (shuffledCards && card < shuffledCards.length - 1) {
      getImages()
    }
  }, [card, cards, getLocalUrl, shuffledCards])

  useEffect(() => {
    if (cards) {
      const shuffled = shuffle([...cards])
      setShuffleCards(shuffled)
      setCard(0)
      if (shuffled[0].image) {
        setImage0(getLocalUrl(shuffled[0].image))
      }
      if (shuffled[0].imageAnswer) {
        setImageAnswer0(getLocalUrl(shuffled[0].imageAnswer))
      }
    }
  }, [cards, getLocalUrl])

  if (isError)
    return (
      <SnackbarContent
        message={'Les cartes ne se sont pas chargées ! ' + isError}
        close
        color='danger'
      />
    )

  if (IsFinished)
    return <Redirect to={`/flash-cards/${subject}/${domain}?grade=${grade}`} />

  if (!shuffledCards.length) return null

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
                preloadImages
                promiseForImageLocalUrl={
                  card === 0 ? image0 : promiseForImageLocalUrl
                }
                promiseForImageAnswerLocalUrl={card === 0 ? imageAnswer0 : promiseForImageAnswerLocalUrl}
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
