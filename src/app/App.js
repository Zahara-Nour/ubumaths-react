import React from 'react'
import './App.scss'
// import Nav from 'components/Nav'
import { Switch, Route, Redirect } from 'react-router-dom'
// import Mental from 'features/mental/Mental'

import Mental from 'features/mental/Mental'
import { Container } from '@material-ui/core'
import Dashboard from 'features/dashboard/Dashboard'
import { selectUser } from 'features/auth/authSlice'
import { useSelector } from 'react-redux'
import Home from 'components/Home'
import NavBar from 'components/NavBar'
import FlashCards from 'features/flash-cards/FlashCards'

function App() {
  return (
    <Container fixed>
      <Switch>
        <PrivateRoute path='/dashboard'>
          <Dashboard />
        </PrivateRoute>
        {/* <Route path='/dashboard' component={Dashboard} /> */}
        <Route path='/calcul-mental' component={Mental} />
        <Route path='/flash-cards' component={FlashCards} />
        <Route path='/' component={Home} />
      </Switch>
    </Container>
  )
}

export default App

function PrivateRoute({ children, ...rest }) {
  const user = useSelector(selectUser)
  return (
    <Route
      {...rest}
      render={() =>
        user.role !== 'guest' ? (
          
            children
          
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
