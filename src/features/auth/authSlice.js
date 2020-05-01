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
  user: { role: 'guest' },
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
    logoutFailure(state, action) {
      state.disconnecting = false
      state.logOutError = action.payload.error
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
  logoutFailure,
  updateUser,
} = authSlice.actions

const selectUser = (state) => state.auth.user
const selectConnected = (state) => state.auth.connected

export { selectUser, selectConnected }

function fetchUser({ id }) {
  return function (dispatch) {
    dispatch(fetchRequest({ type: FETCH_USER }))
    db.collection('Users')
      .doc(id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          dispatch(fetchSuccess({ data: doc.data(), type: FETCH_USER }))

          dispatch(updateUser({ user: doc.data() }))
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
        dispatch(fetchFailure({ error }))
        console.error('Error loading document: ', error)
      })
  }
}

export { fetchUser }


export default authSlice.reducer
