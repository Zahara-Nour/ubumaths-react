import React, { useState, useEffect, useCallback } from 'react'
import { useScript } from 'app/hooks'
import Button from 'components/CustomButtons/Button'
import { useDispatch, useSelector } from 'react-redux'
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  fetchUser,
  logoutFailure,
} from './authSlice'
import { selectConnected } from './authSlice'

export default function AuthButton() {
  const [auth2, setAuth2] = useState()
  const dispatch = useDispatch()
  const connected = useSelector(selectConnected)
  const [loaded, error] = useScript('https://apis.google.com/js/api.js')
  const ClientId =
    '702572178697-3pdjj0caro5u0ttpft17ppc0fnlmol1p.apps.googleusercontent.com'

  const handleLoginSuccess = useCallback(
    (response) => {
     
      const profile = response.getBasicProfile()
      const authResponse = response.getAuthResponse()
      const userProfile = {
        googleId: profile.getId(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail(),
        name: profile.getName(),
        givenName: profile.getGivenName(),
        familyName: profile.getFamilyName(),
        tokenObj: authResponse,
        tokenId: authResponse.id_token,
        accessToken: authResponse.access_token,
      }
      dispatch(
        loginSuccess({
          user: userProfile,
        }),
      )

      dispatch(fetchUser({ id: profile.getEmail() }))
    },
    [dispatch],
  )

  const handleLoginFailure = useCallback(
    (response) => {
     
      dispatch(loginFailure({ error: response.error }))
    },
    [dispatch],
  )

  const handleLogoutSuccess = useCallback(
    (response) => {
    
      dispatch(logoutSuccess())
    },
    [dispatch],
  )

  const handleLogoutFailure = useCallback(
    (response) => {
   
      dispatch(logoutFailure())
    },
    [dispatch],
  )

  useEffect(() => {
    if (loaded) {
      window.gapi.load('auth2', () => {
        window.gapi.auth2
          .init({
            client_id: ClientId,
          })
          .then((auth2) => {
            setAuth2(auth2)
            if (auth2.isSignedIn.get()) {
              handleLoginSuccess(auth2.currentUser.get())
            }
          })
      })
    }
  }, [loaded, handleLoginSuccess])

  return connected ? (
    <Button
      color='success'
      onClick={() => {
        dispatch(logoutRequest())
        auth2.signOut().then(
          (res) => handleLogoutSuccess(res),
          (err) => handleLogoutFailure(err),
        )
      }}
    >
      Logout
    </Button>
  ) : (
    <Button
      color='danger'
      onClick={() => {
        dispatch(loginRequest())
        const options = {
          prompt: '',
        }
        auth2.signIn(options).then(
          (res) => handleLoginSuccess(res),
          (err) => handleLoginFailure(err),
        )
      }}
    >
      Login
    </Button>
  )
}

// <div id='loginButton'></div>
