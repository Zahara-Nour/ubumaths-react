import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from 'features/auth/authSlice'
import { Route } from 'react-router-dom'
import NavBar from './NavBar'

function PrivateRoute({ component: Component, render, ...rest }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const renderProp = render || ((props) => <Component {...props} />)

  return isLoggedIn ? (
    <Route {...rest} render={renderProp} />
  ) : (
    <div>
      <NavBar />
      <h5> Vous devez vous connecter pour accéder à cette page.</h5>
    </div>
  )
}

export default PrivateRoute
