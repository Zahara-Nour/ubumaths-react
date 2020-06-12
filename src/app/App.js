import React from 'react'
import './App.scss'
// import Nav from 'components/Nav'
import { Switch, Route } from 'react-router-dom'
// import Mental from 'features/mental/Mental'

import Mental from 'features/mental/Mental'
import Dashboard from 'features/dashboard/Dashboard'
import Home from 'components/Home'
import NavBar from 'components/NavBar'
import FlashCards from 'features/flash-cards/FlashCards'
// import DbCache from './DbCache'
import Error404 from 'components/Error404'
import Technical from 'components/Technical'
import PrivateRoute from 'components/PrivateRoute'


function App() {
  return (
    <>
      {/* <DbCache /> */}

      <Switch>
        <PrivateRoute path='/dashboard' component={Dashboard} />
        <Route path='/calcul-mental' component={Mental} />
        <Route path='/flash-cards' component={FlashCards} />
        <Route path='/technical-info' component={Technical} />
        <Route exact path='/' component={Home} />
        <Route
          render={() => (
            <>
              <NavBar />
              <Error404 />
            </>
          )}
        />
      </Switch>
    </>
  )
}

export default App

