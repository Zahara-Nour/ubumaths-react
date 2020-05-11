import React from 'react'
import './App.scss'
// import Nav from 'components/Nav'
import { Switch, Route } from 'react-router-dom'
// import Mental from 'features/mental/Mental'

import Mental from 'features/mental/Mental'
import Dashboard from 'features/dashboard/Dashboard'
import { selectUser, selectIsLoggedIn } from 'features/auth/authSlice'
import { useSelector } from 'react-redux'
import Home from 'components/Home'
import NavBar from 'components/NavBar'
import FlashCards from 'features/flash-cards/FlashCards'
import DbCache from './DbCache'

function App() {
  return (
    <div>
      <DbCache />
      <Switch>
        <PrivateRoute path='/dashboard' component={Dashboard} />
        <Route path='/calcul-mental' component={Mental} />
        <Route path='/flash-cards' component={FlashCards} />
        <Route path='/' component={Home} />
      </Switch>
    </div>
  )
}

export default App

function PrivateRoute({ component: Component, ...rest }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <div>
            <NavBar />
            <h5> Vous devez vous connecter pour accéder à cette page.</h5>
          </div>
        )
      }
    />
  )
}
