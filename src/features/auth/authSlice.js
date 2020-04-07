import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  connecting: false,
  disconnecting: false,
  connected: false,
  user: null,
  loginError: null,
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
      state.user = null
    },
  },
})

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
} = authSlice.actions


const selectUser = (state) => state.auth.user
const selectConnected = (state) => state.auth.connected

export {selectUser, selectConnected}

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
