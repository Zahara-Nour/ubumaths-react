import { createSlice } from '@reduxjs/toolkit'
import { math } from 'tinycas/build/math/math'
import db from '../../app/db'

function generateQuestions(questions) {
  return questions.map((question) => {
    const { expression, ...rest } = question
    return {
      text: math(expression).generate().string,
      ...rest,
    }
  })
}
const initialState = {
  rawQuestions: [],
  generatedQuestions: [],
  fetching: false,
  fetchError: false,
  fetched: false,
  dataFetched: null,
  ready: false,
  finished: false,
  category: null,
  subcategory: null,
  subsubcategory: null,
  level: 1,
  saving: false,
  saved: false,
  saveError: '',
}

const mentalSlice = createSlice({
  name: 'mental',
  initialState: initialState,
  reducers: {
    launchAssessment(state) {
      state.generatedQuestions = generateQuestions(state.rawQuestions)
      state.ready = true
    },

    assessmentFinished(state) {
      state.finished = true
    },

    addToBasket(state, action) {
      state.rawQuestions.push(action.payload.question)
    },

    removeFromBasket(state, action) {
      state.rawQuestions.splice(action.payload.id, 1)
    },

    cleanBasket(state) {
      state.rawQuestions = []
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

    fetchRequest(state) {
      state.fetching = true
      state.fetched = false
      state.fetchError = false
      state.dataFetched = null
    },

    fetchFailure(state, action) {
      state.fetching = false
      state.fetchError = action.payload.error
    },

    fetchSuccess(state, action) {
      state.fetching = false
      state.fetched = true
      state.dataFetched = action.payload.data
    },
  },
})

export const {
  launchAssessment,
  assessmentFinished,
  selectAssessment,
  prepareQuestions,
  addToBasket,
  removeFromBasket,
  cleanBasket,
  saveFailure,
  saveRequest,
  saveSuccess,
  saveReset,
  fetchFailure,
  fetchRequest,
  fetchSuccess,
} = mentalSlice.actions

const selectReady = (state) => state.mental.ready
const selectFetched = (state) => state.mental.fetched
const selectDataFetched = (state) => state.mental.dataFetched
const selectFinished = (state) => state.mental.finished
const selectSaving = (state) => state.mental.saving
const selectSaved = (state) => state.mental.saved
const selectSaveError = (state) => state.mental.saveError
const selectRawQuestions = (state) => state.mental.rawQuestions
const selectGeneratedQuestions = (state) => state.mental.generatedQuestions

export {
  selectReady,
  selectFinished,
  selectRawQuestions,
  selectGeneratedQuestions,
  selectSaving,
  selectSaveError,
  selectSaved,
  selectFetched,
  selectDataFetched,
}

function saveBasketThunk(questions, title, template) {
  const collection = template ? 'mental-templates' : 'mental-assessments'
  return function (dispatch) {
    dispatch(saveRequest())
    db.collection(collection)
      .doc(title)
      .set({ questions })
      .then(function () {
        dispatch(saveSuccess())
        console.log('Document successfully written!')
      })
      .catch(function (error) {
        dispatch(saveFailure({ error }))
        console.error('Error writing document: ', error)
      })
  }
}

function loadAssessmentsThunk(template) {
  const collection = template ? 'mental-templates' : 'mental-assessments'
  return function (dispatch) {
    dispatch(fetchRequest())
    db.collection(collection)
      .get()
      .then(function (querySnapshot) {
        const datas = []
        querySnapshot.forEach(function (doc) {
          datas.push({ ...doc.data(), title: doc.id })
          console.log(doc.id, ' => ', doc.data())
        })
        dispatch(fetchSuccess({ data: datas }))
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
        dispatch(fetchFailure({ error }))
      })
  }
}

export { saveBasketThunk, loadAssessmentsThunk }

export default mentalSlice.reducer
