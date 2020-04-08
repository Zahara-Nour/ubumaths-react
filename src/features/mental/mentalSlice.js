import { createSlice } from '@reduxjs/toolkit'
import { math } from 'tinycas/build/math/math'

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
  ready: false,
  finished: false,
  category: null,
  subcategory: null,
  subsubcategory: null,
  level: 1,
  saving: false,
  saved: false,
  saveError: false,
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

    selectAssessment(state, action) {
      state.nbQuestions = action.payload.nbQuestions
      state.defaultDelay = action.payload.defaultDelay
      state.monoAssessment = action.payload.monoAssessment
      state.mixedAssessment = action.payload.assessmentId
      state.isSelected = true
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

    saveBasketRequest(state) {
      state.savingBasket = true
      state.savingBasketSuccess = false
      state.savingBasketError = false
    },
    saveBasketFailure(state, action) {
      state.savingBasket = false
      state.savingBasketError = action.payload.error
    },
    saveBasketSuccess(state, action) {
      state.savingBasket = false
      state.savingBasketSuccess = true
    },

    fechBasketRequest(state) {
      state.fetching = true
      state.fetched = false
      state.fetchError = false
    },

    fetchBasketFailure(state, action) {
      state.fetching = false
      state.fetchError = action.payload.error
    },

    fetchBasketSuccess(state, action) {
      state.fetching = false
      state.fetched = true
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
  saveBasketFailure,
  saveBasketRequest,
  saveBasketSuccess,
  fetchBasketFailure,
  fetchBasketRequest,
  fetchBasketSuccess,
} = mentalSlice.actions


const selectReady = (state) => state.mental.ready
const selectFinished = (state) => state.mental.finished
const selectRawQuestions = (state) => state.mental.rawQuestions
const selectGeneratedQuestions = (state) => state.mental.generatedQuestions

export {selectReady,selectFinished, selectRawQuestions, selectGeneratedQuestions}

export default mentalSlice.reducer
