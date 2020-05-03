import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fetching: {},
  fetchError: {},
  fetched: {},
  saving: false,
  saved: false,
  saveError: '',
}

const dbSlice = createSlice({
  name: 'db',
  initialState: initialState,
  reducers: {
    saveRequest(state) {
      state.saving = true
      state.saved = false
      state.saveError = ''
    },
    saveFailure(state, action) {
      state.saving = false
      state.saveError = action.payload.error
    },
    saveSuccess(state, action) {
      state.saving = false
      state.saved = true
    },
    saveReset(state) {
      state.saving = false
      state.saved = false
      state.saveError = ''
    },

    fetchRequest(state, action) {
      const type = action.payload.type
      state.fetching[type] = true
      state.fetched[type] = null
      state.fetchError[type] = null
    },
    fetchReset(state, action) {
      const type = action.payload.type
      state.fetching[type] = false
      state.fetched[type] = null
      state.fetchError[type] = null
    },

    fetchFailure(state, action) {
      const type = action.payload.type
      state.fetching[type] = false
      state.fetchError[type] = action.payload.error
    },

    fetchSuccess(state, action) {
      const type = action.payload.type
      state.fetching[type] = false
      state.fetched[type] = action.payload.data
    },
  },
})

const FETCH_ASSESSMENTS = 'assessments'
const FETCH_ASSESSMENT = 'assessment'
const FETCH_CLASSES = 'classes'
const FETCH_STUDENTS = 'students'
const FETCH_USER = 'user'
const FETCH_ASSIGNED_ASSESSMENTS = 'assigned-assessments'
const FETCH_CARDS = 'cards'
const FETCH_CARDS_THEMES = 'cards-themes'
const FETCH_SUBJECTS = 'subjects'

export {
  FETCH_ASSESSMENT,
  FETCH_ASSESSMENTS,
  FETCH_CLASSES,
  FETCH_USER,
  FETCH_ASSIGNED_ASSESSMENTS,
  FETCH_STUDENTS,
  FETCH_CARDS,
  FETCH_CARDS_THEMES,
  FETCH_SUBJECTS
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
} = dbSlice.actions

const selectFetching = (type) => (state) => state.db.fetching[type]
const selectFetched = (type) => (state) => state.db.fetched[type]
const selectFetchError = (type) => (state) => state.db.fetchError[type]
const selectSaving = (state) => state.db.saving
const selectSaved = (state) => state.db.saved
const selectSaveError = (state) => state.db.saveError

export {
  selectSaving,
  selectSaveError,
  selectSaved,
  selectFetched,
  selectFetching,
  selectFetchError,
}

export default dbSlice.reducer
