import React, { useState, useEffect, useCallback } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth';
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
import { selectIsLoggedIn } from './authSlice'
import {RiLoginBoxLine} from 'react-icons/ri'
import {RiLogoutBoxRLine} from 'react-icons/ri'

export default function AuthButton() {
  const [auth2, setAuth2] = useState()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const [loaded, error] = useScript('https://apis.google.com/js/api.js')
  const ClientId =
    '702572178697-3pdjj0caro5u0ttpft17ppc0fnlmol1p.apps.googleusercontent.com'

  const handleLoginSuccess = useCallback(
    (googleUser) => {
      console.log('Google Auth Response', googleUser)
      // We need to register an Observer on Firebase Auth to make sure auth is initialized.
      const profile = googleUser.getBasicProfile()
      const authResponse = googleUser.getAuthResponse()

      if (!profile.getEmail().includes('@voltairedoha.com') && profile.getEmail()!=='zahara.alnour@gmail.com') {
        console.log("Erreur connexion avec un mail n'appartenant pas au domaine voltairedoha.com")
        return
      }
      var unsubscribe = firebase
        .auth()
        .onAuthStateChanged(function (firebaseUser) {
          unsubscribe()
          // Check if we are already signed-in Firebase with the correct user.
          if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
              authResponse.id_token,
            )
            // Sign in with credential from the Google user.
            firebase
              .auth()
              .signInWithCredential(credential)
              .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code
                var errorMessage = error.message
                // The email of the user's account used.
                var email = error.email
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential
                // ...
                console.error("error while authenticating in Firebase", error)
              })
          } else {
            console.log('User already signed-in Firebase.')
          }
        })

      
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

  if (!auth2) return null

  return isLoggedIn ? (
    <Button
   
      color='success'
      justIcon
      round
      disabled={!loaded}
      onClick={() => {
        dispatch(logoutRequest())
        auth2.signOut().then(
          (res) => handleLogoutSuccess(res),
          (err) => handleLogoutFailure(err),
        )
        firebase.auth().signOut().then(function(res) {
          handleLogoutSuccess(res)
        }).catch(function(error) {
          handleLogoutFailure(error)
        });
      }}
    >
      <RiLogoutBoxRLine/>
    </Button>
  ) : (
    <Button
    disabled={!auth2}
    justIcon
    round
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
      <RiLoginBoxLine/>
    </Button>
  )
}

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()
      ) {
        // We don't need to reauth the Firebase connection.
        return true
      }
    }
  }
  return false
}

// <div id='loginButton'></div>
