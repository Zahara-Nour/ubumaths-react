import { createSlice } from '@reduxjs/toolkit'
import {
  fetchRequest,
  fetchSuccess,
  fetchFailure,
  FETCH_USER,
} from 'features/db/dbSlice'

import db from '../../app/db'

const initialState = {
  connecting: false,
  disconnecting: false,
  connected: false,
  user: {role:"guest"},
  // user: {
  //   email: 'd.lejolly@voltairedoha.com',
  //   role: 'teacher',
  //   school: 'Voltaire-Doha-Qatar',
  //   admin: true,
  //   classes: ['6B West Bay', '6C West Bay','5A West Bay','5B West Bay']
  // },
  loginError: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.connecting = true
      state.loginError = null
    },
    loginSuccess(state, action) {
      state.connecting = false
      state.connected = true
      state.user = action.payload.user
    },
    loginFailure(state, action) {
      state.connecting = false
      state.loginError = action.payload.error
    },
    logoutRequest(state) {
      state.disconnecting = true
    },
    logoutSuccess(state) {
      state.disconnecting = false
      state.connected = false
      state.user = { role: 'guest' }
    },

    updateUser(state, action) {
      Object.assign(state.user, action.payload.user)
    },
  },
})

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  updateUser,
} = authSlice.actions

const selectUser = (state) => state.auth.user
const selectConnected = (state) => state.auth.connected

export { selectUser, selectConnected }

function fetchUserThunk({ id }) {
  return function (dispatch) {
    dispatch(fetchRequest({ type: FETCH_USER }))
    db.collection('Users')
      .doc(id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data())
          dispatch(fetchSuccess({ data: doc.data(), type: FETCH_USER }))
          console.log('updating user')
          dispatch(updateUser({ user: doc.data() }))

          console.log('Document successfully loaded!')
        } else {
          // doc.data() will be undefined in this case
          dispatch(
            fetchFailure({
              error: 'Aucun document trouvé ',
              type: FETCH_USER,
            }),
          )
          console.log('No such document!')
        }
      })
      .catch(function (error) {
        //dispatch(fetchFailure({ error }))
        console.error('Error loading document: ', error)
      })
  }
}

export { fetchUserThunk }

// export function verifyAuth() {
//   return dispatch => {
//     dispatch(verifyAuthRequest())
//     const user = localStorage.getItem('myPage.expectSignIn')
//     if (user) dispatch(loginSuccess({ user }))
//     console.log('user')
//     console.log(user)

//     firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         localStorage.setItem('myPage.expectSignIn', user.email)
//       } else {
//         localStorage.removeItem('myPage.expectSignIn')
//       }
//     })

//     dispatch(verifyAuthSuccess())
//   }
// }

export default authSlice.reducer
