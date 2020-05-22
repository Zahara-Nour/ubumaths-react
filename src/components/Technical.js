import React from 'react'

// core components
import NavBar from './NavBar'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import Heading from 'components/Heading/Heading.js'
import Timeline from 'components/Timeline/Timeline.js'
import Card from 'components/Card/Card.js'
import CardBody from 'components/Card/CardBody.js'


import { Container } from '@material-ui/core'
import Footer from './Footer/Footer'
import { makeStyles } from '@material-ui/core/styles'
import styles from 'assets/jss/homeStyle.js'

import { ReactComponent as ReactLogo } from 'assets/Icons/react-logo.svg'
import { ReactComponent as FirebaseLogo } from 'assets/Icons/firebase-icon.svg'
import { ReactComponent as MathliveLogo } from 'assets/Icons/pi.svg'

const useStyles = makeStyles(styles)

const stories = [
  {
    // First story
    inverted: true,
    badgeColor: 'react',
    badgeIcon: ReactLogo,
    title: 'React',
    titleColor: 'react',
    body: (
      <p>
        React est une librairie Javascript qui permet de créer une interface
        utilisateur à l'aide de composants réutilisables.
      </p>
    ),
  },
  {
    // Second story
    badgeColor: 'white',
    badgeIcon: FirebaseLogo,
    title: 'Firebase',
    titleColor: 'firebase',
    body: (
      <p>
        Firebase est un service Google (en partie gratuit) pour héberger des
        applications monopages associées à une base de données NoSql.
      </p>
    ),
  },
  {
    // Third story
    inverted: true,
    badgeColor: 'success',
    badgeIcon: MathliveLogo,
    title: 'MathLive',
    titleColor: 'success',
    body: (
      <div>
        <p>
          MathLive permet le rendu des expressions mathématiques et leur
          édition.
        </p>
      </div>
    ),
  },
]

export default function Technical() {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <NavBar />
      <div className={classes.content}>
        <Container fixed>
          <h3>Infos techniques</h3>
          <p>
            Ubu Maths est une application monopage (SPA) écrite en javascript. La pile technologique est la suivante :
          </p>
          <GridContainer>
            <GridItem xs={12}>
              <Card plain>
                <CardBody plain>
                  <Timeline stories={stories} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Container>
      </div>
      <Footer fluid />
    </div>
  )
}
