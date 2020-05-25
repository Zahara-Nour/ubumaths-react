import React from 'react'
import spiralPi from 'assets/img/spiral-pi-clean.png'
import { Container } from '@material-ui/core'
import GridContainer from './Grid/GridContainer'
import GridItem from './Grid/GridItem'
import styles from 'assets/jss/components/error404Style.js'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(styles)

function Error404() {
  const classes = useStyles()
  return (
    <Container fixed>
      <h2>
        Page introuvable !
       
      </h2>
      <GridContainer justify='center'>
        <GridItem xs={10} md={6}>
          <img className={classes["pi-spiral"]} src={spiralPi} alt='pi decimals' width='100%' />
        </GridItem>
      </GridContainer>
    </Container>
  )
}

export default Error404
