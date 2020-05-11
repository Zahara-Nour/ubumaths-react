import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fetching: {},
  fetchError: {},
  fetched: {},
  saving: false,
  saved: false,
  saveError: '',
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
    addCardsLevels(state, action) {
      state.cardsLevels = state.cardsLevels.concat(action.payload.cardsLevels)
    },

    setGrades(state, action) {
      state.grades = action.payload.grades
    },
    setSubjects(state, action) {
      state.subjects = action.payload.subjects
    },

    setDomains(state, action) {
      state.domains[action.payload.subject] = action.payload.domains
    },

    setThemes(state, action) {
      state.themes[action.payload.subject] = {
        ...state.themes[action.payload.subject],
        [action.payload.domain]: action.payload.themes,
      }
    },

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
      const key = action.payload.key
      const type = action.payload.type
      state.fetching[type] = false
      state.fetchError[type] = action.payload.error
      state.queue.splice(state.queue.indexOf(key), 1)
    },

    fetchSuccess(state, action) {
      const key = action.payload.key
      const type = action.payload.type
      state.fetching[type] = false
      state.fetched[type] = action.payload.data
      state.queue.splice(state.queue.indexOf(key), 1)
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
const FETCH_CARDS_LEVELS = 'cards-levels'
const FETCH_THEMES = 'themes'
const FETCH_DOMAINS = 'domains'
const FETCH_SUBJECTS = 'subjects'
const FETCH_GRADES = 'grades'

export {
  FETCH_ASSESSMENT,
  FETCH_ASSESSMENTS,
  FETCH_CLASSES,
  FETCH_USER,
  FETCH_ASSIGNED_ASSESSMENTS,
  FETCH_STUDENTS,
  FETCH_CARDS,
  FETCH_CARDS_LEVELS,
  FETCH_THEMES,
  FETCH_DOMAINS,
  FETCH_SUBJECTS,
  FETCH_GRADES,
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
  setDomains,
  setSubjects,
  setThemes,
  setGrades,
  addCardsLevels,
} = dbSlice.actions

const selectGrades = (state) => state.db.grades
const selectSubjects = (state) => state.db.subjects
const selectDomains = (subject) => (state) => state.db.domains[subject]
const selectThemes = (subject, domain) => (state) =>
  state.db.themes[subject] && state.db.themes[subject][domain]
const selectFetching = (type) => (state) => state.db.fetching[type]
const selectFetched = (type) => (state) => state.db.fetched[type]
const selectFetchError = (type) => (state) => state.db.fetchError[type]
const selectSaving = (state) => state.db.saving
const selectSaved = (state) => state.db.saved
const selectSaveError = (state) => state.db.saveError
const selectCardslevels = (state) => state.db.cardsLevels
const selectIsLoading = (state) => state.db.queue.length > 0

let count = 0
export const fetchDb = (param) => (dispatch) => {
  dispatch(fetchRequest({ ...param, key: count }))

  return count++
}

export {
  selectSaving,
  selectSaveError,
  selectSaved,
  selectFetched,
  selectFetching,
  selectFetchError,
  selectDomains,
  selectThemes,
  selectSubjects,
  selectGrades,
  selectCardslevels,
  selectIsLoading,
}

export default dbSlice.reducer
