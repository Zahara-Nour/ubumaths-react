import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from 'features/auth/authSlice'
import mentalReducer from 'features/mental/mentalSlice'
import dbReducer from 'features/db/dbSlice'
import maintenanceReducer from 'features/maintenance/maintenanceSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const reducers = combineReducers({
  auth:authReducer,
  mental:mentalReducer,
  db:dbReducer,
  maintenance:maintenanceReducer
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth', 'mental', 'db']
}

const persistedReducer = persistReducer(persistConfig, reducers)


const store = configureStore({
  reducer: persistedReducer,
})

const persistore = persistStore(store)

export {store, persistore}

// export default configureStore({
//   reducer: {
//     auth:authReducer,
//     mental:mentalReducer,
//     db:dbReducer
//   }
// })

