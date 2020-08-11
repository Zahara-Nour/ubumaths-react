import React, { useEffect, useCallback, useState, useRef } from 'react'

import { makeStyles } from '@material-ui/core/styles'
// @material-ui icons
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import RefreshIcon from '@material-ui/icons/Refresh'
// core components
import Success from 'components/Typography/Success'

import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody'
import Button from 'components/CustomButtons/Button'
import Mathlive from 'mathlive'

import cardsStyle from 'assets/jss/layouts/flash-cards'
import Info from 'components/Typography/Info'
import Warning from 'components/Typography/Warning'
import { ErrorBoundary } from 'react-error-boundary'
import { storage } from 'features/db/db'
import { getLogger, dataURItoBlob } from 'app/utils'
import GridSpinner from 'components/GridSpinner'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import LazyLoad from 'react-lazyload'
import FadeIn from 'components/FadeIn'

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

export default function DisplayflashCard(props) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => console.log('ErrorBoundary', error.message)}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <FlashCard {...props} />
    </ErrorBoundary>
  )
}

function FlashCard({
  card,
  onNext,
  isLast,
  preloadImages,
  promiseForImageLocalUrl,
  promiseForImageAnswerLocalUrl,
}) {
  const { trace, error } = getLogger('FlashCard', 'trace')
  const classes = useStyles()
  const [activeRotate, setActiveRotate] = useState('')
  const [pending, setPending] = useState(false)
  const [imgUrl, setImgUrl] = useState()
  const [imgAnswerUrl, setImgAnswerUrl] = useState()
  const cardRef = useRef()
  const [imageWidth, setImageWidth] = useState()
  const [imageAnswerWidth, setImageAnswerWidth] = useState()

  useEffect(() => {
    Mathlive.renderMathInDocument()
  })

  // console.log('flash card', card)
  trace('promiseForImageLocalUrl', promiseForImageLocalUrl)

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
  }, [addStylesForRotatingCards, activeRotate])

  useEffect(() => {
    Mathlive.renderMathInDocument()
  })

  useEffect(() => {
    setImgUrl(null)
    setImageWidth(null)
    setImgAnswerUrl(null)
    setImageAnswerWidth(null)
  }, [card])

  useEffect(() => {
    async function getImages() {
      if (card.image && preloadImages && promiseForImageLocalUrl) {
        const localUrl = await promiseForImageLocalUrl
        setImgUrl(localUrl)
      }
    }

    getImages()
  }, [card, promiseForImageLocalUrl, preloadImages])

  useEffect(() => {
    async function getImages() {
      if (card.imageAnswer && preloadImages && promiseForImageAnswerLocalUrl) {
        const localUrl = await promiseForImageAnswerLocalUrl
        setImgAnswerUrl(localUrl)
      }
    }

    getImages()
  }, [card, preloadImages, promiseForImageAnswerLocalUrl])

  if (!card) return null

  const gridItemRatio = 9

  const onLoadFakeImage = ({ target: image }) => {
    const cardWidth = cardRef.current.getBoundingClientRect().width
    const width =
      image.width < (gridItemRatio / 12) * cardWidth
        ? image.width
        : (gridItemRatio / 12) * cardWidth

    setImageWidth(width)
  }

  const onLoadFakeImageAnswer = ({ target: image }) => {
    const cardWidth = cardRef.current.getBoundingClientRect().width
    const width =
      image.width < (gridItemRatio / 12) * cardWidth
        ? image.width
        : (gridItemRatio / 12) * cardWidth

    setImageAnswerWidth(width)
  }

  const shouldCalculateImageWidth = !!card.image && !!imgUrl && !imageWidth
  const shouldCalculateImageAnswerWidth =
    !!card.imageAnswer && !!imgAnswerUrl && !imageAnswerWidth
  const isImageWidthCalculated = !!imageWidth
  const isImageAnswerWidthCalculated = !!imageAnswerWidth
  const shouldDisplayImageSpinner =
    !!card.image && (!imgUrl || !isImageWidthCalculated)
  const shouldDisplayImageAnswerSpinner =
    !!card.imageAnswer && (!imgAnswerUrl || !isImageAnswerWidthCalculated)

  return (
    <div>
      {shouldCalculateImageWidth && (
        <img
          alt='flash card'
          style={{ position: 'fixed', opacity: 0 }}
          src={imgUrl}
          onLoad={onLoadFakeImage}
        />
      )}
      {shouldCalculateImageAnswerWidth && (
        <img
          alt='flash card answer'
          style={{ position: 'fixed', opacity: 0 }}
          src={imgAnswerUrl}
          onLoad={onLoadFakeImageAnswer}
        />
      )}

      <div
        className={
          classes.rotatingCardContainer +
          ' ' +
          classes.manualRotate +
          ' ' +
          activeRotate
        }
      >
        <Card className={classes.cardRotate} ref={cardRef}>
          <div className={classes.front}>
            <CardBody className={classes.cardBodyRotate}>
              <Info>
                <h5 className={classes.cardCategorySocial}>
                  <i className='far fa-newspaper' /> {card.theme}
                </h5>
              </Info>
              <br />
              <h4 className={classes.cardTitle}>{card.enounce}</h4>
              {shouldDisplayImageSpinner && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-block' }}>
                    <GridSpinner />
                  </div>
                </div>
              )}
              {isImageWidthCalculated && (
                <GridContainer justify='center'>
                  <GridItem xs={gridItemRatio}>
                    <FadeIn height={400}>
                      {(onLoad) => (
                        <img
                          alt='flash card'
                          src={imgUrl}
                          onLoad={() => {
                            addStylesForRotatingCards()
                            onLoad()
                          }}
                          width={imageWidth}
                        />
                      )}
                    </FadeIn>
                  </GridItem>
                </GridContainer>
              )}
              <br />
              <div className={classes.buttonsBottom}>
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
              <h3 className={classes.cardTitle}>
                {pending ? '' : card.answer}
              </h3>
              {shouldDisplayImageAnswerSpinner && <GridSpinner />}
              {!pending && isImageAnswerWidthCalculated && (
                <GridContainer justify='center'>
                  <GridItem xs={gridItemRatio}>
                    {/* <Image /> */}
                    <FadeIn height={400}>
                      {(onLoad) => (
                        <img
                          alt='flash card'
                          src={imgAnswerUrl}
                          onLoad={() => {
                            addStylesForRotatingCards()
                            onLoad()
                          }}
                          width={imageAnswerWidth}
                        />
                      )}
                    </FadeIn>
                  </GridItem>
                </GridContainer>
              )}

              <br />

              <p className={classes.cardDescription}>{card.explanation}</p>

              <Warning>{card.warning}</Warning>

              <div className={classes.buttonsBottom}>
                <Button
                  round
                  color='success'
                  onClick={() => setActiveRotate('')}
                >
                  <RefreshIcon /> Question
                </Button>
                <Button
                  round
                  color='success'
                  onClick={() => {
                    if (onNext) {
                      setImgUrl(null)
                      setImgAnswerUrl(null)
                      setImageWidth(null)
                      setImageAnswerWidth(null)
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
                  <NavigateNextIcon /> {isLast ? 'Fin' : 'Suivante'}
                </Button>
              </div>
            </CardBody>
          </div>
        </Card>
      </div>
    </div>
  )
}
