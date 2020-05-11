import React from 'react'
import NavBar from './NavBar'
import { Container, Hidden } from '@material-ui/core'
import GridContainer from './Grid/GridContainer'
import GridItem from './Grid/GridItem'
import ubu from 'assets/img/Ubu-large-color.png'

function Home() {
  return (
    <>
      <NavBar />
      <Container fixed>
      <GridContainer>
      <GridItem xs={12} sm={12} md={3} lg={3}>
          <Hidden smDown>
          <img width='90%' src={ubu} alt='Père ubu'/>
          </Hidden>
      </GridItem>
      <GridItem xs={12} sm={12} md={9} lg={9}>
      <h1> Bienvenue sur le site de M. Le Jolly !</h1>
      <img
        alt='toto'
        src='https://drive.google.com/file/d/124iv4KovsqlgAjsFNNV_OWpJzypY2jqK/view'
      />
      <img
        alt='toto'
        src='https://drive.google.com/uc?export=view&id=124iv4KovsqlgAjsFNNV_OWpJzypY2jqK'
      />
      </GridItem>
      </GridContainer>
    </Container>
    </>
  )
}

export default Home
