import { configureStore } from '@reduxjs/toolkit'
import authReducer from 'features/auth/authSlice'
import mentalReducer from 'features/mental/mentalSlice'
import dbReducer from 'features/db/dbSlice'



export default configureStore({
  reducer: {
    auth:authReducer,
    mental:mentalReducer,
    db:dbReducer
  }
})

