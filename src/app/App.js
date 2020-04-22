import React from 'react'
import './App.scss'
// import Nav from 'components/Nav'
import { Switch, Route } from 'react-router-dom'
// import Mental from 'features/mental/Mental'

import Mental from 'features/mental/Mental'
import { Container } from '@material-ui/core'



function App() {
  return (
   <Container fixed>
    <Switch>
      <Route path='/' component={Mental} />
     
    </Switch>
    </Container>
  )
}

export default App
