import React from 'react'
import spiralPi from 'assets/img/spiral-pi-clean.png'
import { Container } from '@material-ui/core'
import GridContainer from './Grid/GridContainer'
import GridItem from './Grid/GridItem'
import './Error404.css'

function Error404() {
  return (
    <Container fixed>
      <h3>
        Cette page est introuvable, vraissemblablement perdue dans les décimales
        de pi !
      </h3>
      <GridContainer justify='center'>
        <GridItem xs={10} md={6}>
          <img className='spin' src={spiralPi} alt='pi decimals' width='100%' />
        </GridItem>
      </GridContainer>
    </Container>
  )
}

export default Error404
