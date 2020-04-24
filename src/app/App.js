import React from 'react'
import './App.scss'
// import Nav from 'components/Nav'
import { Switch, Route } from 'react-router-dom'
// import Mental from 'features/mental/Mental'

import Mental from 'features/mental/Mental'
import { Container } from '@material-ui/core'
import Dashboard from 'features/dashboard/Dashboard'

function App() {
  return (
    <Container fixed>
      <Switch>
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/' component={Mental} />
      </Switch>
    </Container>
  )
}

export default App
