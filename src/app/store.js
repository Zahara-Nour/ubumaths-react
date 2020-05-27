import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import authReducer from 'features/auth/authSlice'
import mentalReducer from 'features/mental/mentalSlice'
import dbReducer from 'features/db/dbSlice'
import maintenanceReducer from 'features/maintenance/maintenanceSlice'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const reducers = combineReducers({
  auth: authReducer,
  mental: mentalReducer,
  db: dbReducer,
  maintenance: maintenanceReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth', 'mental', 'db'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    // redux-persist actions are not serialisable
    // https://github.com/rt2zz/redux-persist/issues/988#issuecomment-552242978
    serializableCheck: { 
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})

const persistore = persistStore(store)

export { store, persistore }

// export default configureStore({
//   reducer: {
//     auth:authReducer,
//     mental:mentalReducer,
//     db:dbReducer
//   }
// })
