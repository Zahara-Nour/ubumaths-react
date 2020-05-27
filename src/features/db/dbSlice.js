import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fetching: {},
  fetchError: {},
  fetched: {},
  saving: {},
  saved: {},
  saveError: {},
  subjects: [],
  domains: {},
  themes: {},
  grades: [],
  cardsLevels: [],
  queue: [],
}

const dbSlice = createSlice({
  name: 'db',
  initialState: initialState,
  reducers: {

    setCollection(state, action) {
      const { path, filters, documents } = action.payload

      if (!state[path]) state[path] = {}
      const deepness = filters.length

      const modify = (substate, deepLevel) => {
        if (deepLevel === deepness) return documents
        const filter = filters[deepLevel]
        const name = Object.getOwnPropertyNames(filter)[0]
        const value = filter[name]
        return {
          ...substate,
          [value]: modify(
            substate[value] ? substate[value] : {},
            deepLevel + 1,
          ),
        }
      }

      if (deepness === 0) {
        state[path] = documents
      } else {
        try {
          state[path] = modify(state[path], 0)
        } catch (error) {
          console.errror('error in setCollection')
        }
      }
    },

    saveRequest(state, action) {
      const type = action.payload.type
      const key = action.payload.key
      state.saving[type] = true
      state.saved[type] = false
      state.saveError[type] = ''
      state.queue.push(key)
    },

    saveFailure(state, action) {
      const key = action.payload.key
      const type = action.payload.type
      state.saving[type] = false
      state.saved[type] = false
      state.saveError[type] = action.payload.error
      state.queue.splice(state.queue.indexOf(key), 1)
    },

    saveSuccess(state, action) {
      const key = action.payload.key
      const type = action.payload.type
      state.saving[type] = false
      state.saved[type] = action.payload.data
      state.saveError[type] = action.payload.error
      state.queue.splice(state.queue.indexOf(key), 1)
    },

    saveReset(state) {
      state.saving = false
      state.saved = false
      state.saveError = ''
    },

    update(state, action) {
      // console.log('fetchrequest', action.payload)
      const type = action.payload.type 
      state.fetched[type] = action.payload.data
    },

    fetchRemove(state, action) {

      const key = action.payload.key
      const type = action.payload.type
      state.fetching[type] = false
      state.queue.splice(state.queue.indexOf(key), 1)

    },

    fetchRequest(state, action) {
      // console.log('fetchrequest', action.payload)
      const type = action.payload.type
      const key = action.payload.key
      state.fetching[type] = true
      state.fetched[type] = null
      state.fetchError[type] = null
      state.queue.push(key)
    },
    fetchReset(state, action) {
      const type = action.payload.type
      state.fetching[type] = false
      state.fetched[type] = null
      state.fetchError[type] = null
    },

    fetchFailure(state, action) {
      // console.log('fetch failure', action.payload.error)
      const key = action.payload.key
      const type = action.payload.type
      state.fetching[type] = false
      state.fetchError[type] = action.payload.error
      state.queue.splice(state.queue.indexOf(key), 1)
    },

    fetchSuccess(state, action) {
      // console.log('fetch success', action.payload.data)
      const key = action.payload.key
      const type = action.payload.type
      state.fetching[type] = false
      state.fetched[type] = action.payload.data
      state.queue.splice(state.queue.indexOf(key), 1)
    },
  },
})

export const FETCH_TYPES = {
  FETCH_ASSESSMENTS: 'assessments',
  FETCH_ASSESSMENT: 'assessment',
  FETCH_CLASSES: 'classes',
  FETCH_STUDENTS: 'students',
  FETCH_USER: 'user',
  FETCH_ASSIGNED_ASSESSMENTS: 'assigned-assessments',
  FETCH_FLASHCARDS: 'flash-cards',
  FETCH_THEMES: 'themes',
  FETCH_DOMAINS: 'domains',
  FETCH_SUBJECTS: 'subjects',
  FETCH_GRADES: 'grades',
  FETCH_COUNTRIES: 'countries',
  FETCH_CITIES: 'cities',
  FETCH_SCHOOLS: 'schools',
  FETCH_ROLES: 'roles',
  FETCH_CLASSROOMS: 'classrooms',
}

export const SAVE_TYPES = {
  SAVE_SUBJECTS: 'subjects',
  SAVE_DOMAINS: 'domains',
  SAVE_THEMES: 'themes',
  SAVE_COUNTRIES: 'countries',
  SAVE_CITIES: 'cities',
  SAVE_SCHOOLS: 'schools',
  SAVE_ROLES: 'roles',
  SAVE_CLASSROOMS: 'classrooms',
  SAVE_FLASHCARDS: 'flash-cards',
}

export const {
  saveFailure,
  saveRequest,
  saveSuccess,
  saveReset,
  fetchRequest,
  fetchSuccess,
  fetchFailure,
  fetchReset,
  fetchRemove,
  setCollection,
  update,
  
} = dbSlice.actions



const selectFetching = (type) => (state) => state.db.fetching[type]
const selectFetched = (type) => (state) => state.db.fetched[type]
const selectFetchError = (type) => (state) => state.db.fetchError[type]
const selectSaving = (type) => (state) => state.db.saving[type]
const selectSaved = (type) => (state) => state.db.saved[type]
const selectSaveError = (type) => (state) => state.db.saveError[type]
const selectIsLoadingOrSaving = (state) => state.db.queue.length > 0
const selectCollection = (collection, filters) => (state) => {
  let result = state.db[collection]
  if (!result) return null
  filters.forEach((filter) => {
    const name = Object.getOwnPropertyNames(filter)[0]
    const value = filter[name]
    if (!result) return null
    result = result[value]
  })
  return result
}

let count = 0
export const fetchDb = (params) => (dispatch) => {
  dispatch(fetchRequest({ ...params, key: count }))

  return count++
}
export const saveDb = (params) => (dispatch) => {
  dispatch(saveRequest({ ...params, key: count }))

  return count++
}

export {
  selectSaving,
  selectSaveError,
  selectSaved,
  selectFetched,
  selectFetching,
  selectFetchError,
  selectIsLoadingOrSaving,
  selectCollection,
}

export default dbSlice.reducer
