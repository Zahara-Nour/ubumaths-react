import React from 'react'
import './App.scss'
// import Nav from 'components/Nav'
import { Switch, Route } from 'react-router-dom'
// import Mental from 'features/mental/Mental'

import Mental from 'features/mental/Mental'
import Auth from 'layouts/Auth'


function App() {
  return (
    <Switch>
      <Route path='/' component={Mental} />
     
    </Switch>
  )
}

export default App
