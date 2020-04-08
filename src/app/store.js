import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import mentalReducer from '../features/mental/mentalSlice'



export default configureStore({
  reducer: {
    auth:authReducer,
    mental:mentalReducer
  }
})

