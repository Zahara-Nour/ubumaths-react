import React, { useEffect, useCallback, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
// @material-ui icons
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import RefreshIcon from '@material-ui/icons/Refresh'
// core components
import Success from 'components/Typography/Success.js'

import Card from 'components/Card/Card.js'
import CardBody from 'components/Card/CardBody.js'
import Button from 'components/CustomButtons/Button.js'
import Mathlive from 'mathlive'

import cardsStyle from 'assets/jss/layouts/flash-cards'
import Info from 'components/Typography/Info'
import Warning from 'components/Typography/Warning'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, componentStack, resetErrorBoundary }) {
  return (
    <div role='alert'>
      {/* <p>Something went wrong:</p> */}
      <pre>{process.env.NODE_ENV === 'development' ? error.message : null}</pre>
      {/* <pre>{componentStack}</pre> */}
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
    </div>
  )
}

const style = {
  ...cardsStyle,
}

const useStyles = makeStyles(style)

export default function DisplayflashCard({ card, onNext }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={() => console.log('error')}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <FlashCard card={card} onNext={onNext} />
    </ErrorBoundary>
  )
}

function FlashCard({ card, onNext }) {
  
  const classes = useStyles()
  const [activeRotate, setActiveRotate] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    addStylesForRotatingCards()
    return function cleanup() {}
  })

  useEffect(() => {
    Mathlive.renderMathInDocument()
  })

  // console.log('flash card', card)

  const addStylesForRotatingCards = useCallback(() => {
    var rotatingCards = document.getElementsByClassName(classes.cardRotate)
    for (let i = 0; i < rotatingCards.length; i++) {
      var rotatingCard = rotatingCards[i]
      var cardFront = rotatingCard.getElementsByClassName(classes.front)[0]
      var cardBack = rotatingCard.getElementsByClassName(classes.back)[0]
      cardFront.style.height = 'unset'
      cardFront.style.width = 'unset'
      cardBack.style.height = 'unset'
      cardBack.style.width = 'unset'
      var rotatingWrapper = rotatingCard.parentElement
      var cardWidth = rotatingCard.parentElement.offsetWidth
      // var cardHeight = rotatingCard.children[0].children[0].offsetHeight

      var cardHeight = Math.max(
        rotatingCard.children[0].children[0].offsetHeight,
        rotatingCard.children[1].children[0].offsetHeight,
      )
      //  var cardHeight = Math.max(rotatingCard.children[0].children[0].offsetHeight,rotatingCard.children[1].children[0].offsetHeight)
      rotatingWrapper.style.height = cardHeight + 'px'
      rotatingWrapper.style['margin-bottom'] = 30 + 'px'
      cardFront.style.height = 'unset'
      cardFront.style.width = 'unset'
      cardBack.style.height = 'unset'
      cardBack.style.width = 'unset'
      cardFront.style.height = cardHeight + 35 + 'px'
      cardFront.style.width = cardWidth + 'px'
      cardBack.style.height = cardHeight + 35 + 'px'
      cardBack.style.width = cardWidth + 'px'
    }
  }, [classes.front, classes.back, classes.cardRotate])

  useEffect(() => {
    addStylesForRotatingCards()
    return function cleanup() {}
  })

  useEffect(() => {
    Mathlive.renderMathInDocument()
  })
 
  if (!card) return null

  return  (
    <div
      className={
        classes.rotatingCardContainer +
        ' ' +
        classes.manualRotate +
        ' ' +
        activeRotate
      }
    >
      <Card className={classes.cardRotate}>
        <div className={classes.front}>
          <CardBody className={classes.cardBodyRotate}>
            <Info>
              <h5 className={classes.cardCategorySocial}>
                <i className='far fa-newspaper' /> {card.theme}
              </h5>
            </Info>
            <br />
            <h4 className={classes.cardTitle}>{card.enounce}</h4>
            <br />

            <div className={classes.textCenter}>
              <Button
                round
                color='info'
                onClick={() => setActiveRotate(classes.activateRotate)}
              >
                <RefreshIcon /> Réponse
              </Button>
            </div>
          </CardBody>
        </div>
        <div className={classes.back}>
          <CardBody className={classes.cardBodyRotate}>
            <Success>
              <h4>Réponse</h4>
            </Success>
            <br />
            <h2 className={classes.cardTitle}>{pending ? '' : card.answer}</h2>
            <br />

            <p className={classes.cardDescription}>{card.explanation}</p>

            <Warning>{card.warning}</Warning>

            <div className={classes.textCenter}>
              <Button round color='success' onClick={() => setActiveRotate('')}>
                <RefreshIcon /> Question
              </Button>
              <Button
                round
                color='success'
                onClick={() => {
                  if (onNext) {
                    setPending(true)
                    const id = setInterval(() => {
                      clearInterval(id)

                      setPending(false)
                    }, 600)

                    onNext()
                    setActiveRotate('')
                  }
                }}
              >
                <NavigateNextIcon /> Suivante
              </Button>
            </div>
          </CardBody>
        </div>
      </Card>
    </div>
  ) 
}
