import React from 'react'
import './App.scss'
import Nav from 'components/Nav'
import { Switch, Route } from 'react-router-dom'
import Mental from 'features/mental/Mental'

function App() {
  return (
    <>
      <div className="App">
        <Nav />
      </div>
      {/* <Switch>
        <Route path='/calcu-mental' component={Mental} />
      </Switch> */}
      <Mental/>
    </>
  )
}

export default App
