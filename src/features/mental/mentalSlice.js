import { createSlice } from '@reduxjs/toolkit'
import { math } from 'tinycas/build/math/math'
import db from '../../app/db'

function generateQuestions(questions) {
  const generateds = [] // to track duplicated questions
  return questions.map((question) => {
    const { expressions, ...rest } = question
    let i = 0
    let generated
    do {
      generated = math(
        expressions[Math.floor(Math.random() * expressions.length)],
      ).generate().string
      console.log(generated)
      i += 1
    } while (generateds.includes(generated) && i < 3) // one limite à 3 le nombre de tentative au cas il ny ait pas assez de questions différentes.
    generateds.push(generated)

    return {
      text: generated,
      ...rest,
    }
  })
}

const initialState = {
  rawQuestions: [],
  generatedQuestions: [],
  fetching: {},
  fetchError: {},
  fetched: {},
  ready: false,
  finished: false,

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
      state.rawQuestions = state.rawQuestions.concat(action.payload.questions)
    },

    setBasket(state, action) {
      state.rawQuestions = action.payload.questions
    },

    removeFromBasket(state, action) {
      state.rawQuestions.splice(action.payload.id, 1)
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
export { FETCH_ASSESSMENT, FETCH_ASSESSMENTS, FETCH_CLASSES }

export const {
  launchAssessment,
  assessmentFinished,
  prepareQuestions,
  addToBasket,
  removeFromBasket,
  setBasket,
  saveFailure,
  saveRequest,
  saveSuccess,
  saveReset,
  fetchRequest,
  fetchSuccess,
  fetchFailure,
  fetchReset,
} = mentalSlice.actions

const selectReady = (state) => state.mental.ready

const selectFinished = (state) => state.mental.finished
const selectFetching = (type) => (state) => state.mental.fetching[type]
const selectFetched = (type) => (state) => state.mental.fetched[type]
const selectFetchError = (type) => (state) => state.mental.fetchError[type]
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
  selectFetching,
  selectFetchError,
}

function saveBasketThunk({ questions, title, template, classes, students }) {
  const collection = template ? 'mental-templates' : 'mental-assessments'
console.log(classes)
  const assignAssessment = () =>
    classes.forEach((c) => {
      c.students.forEach((student) => {
        db.collection('users')
          .doc(student)
          .collection('assessments')
          .doc(title)
          .set({ id:title,done:false })
          .then(() =>
            console.log('Evaluation ' + title + ' enregisrée pour ' + student),
          )
          .catch((error) => console.error('Error writing document: ', error))
      })
    })

  const saveAssessment = (dispatch) => {
    dispatch(saveRequest())
    db.collection(collection)
      .doc(title)
      .set({ questions })
      .then(() => dispatch(saveSuccess()))
      .then(() => {
        console.log('Enregistrement réussi')
        if (!template) assignAssessment()
      })
      .catch(function (error) {
        dispatch(saveFailure({ error }))
        console.error('Error writing document: ', error)
      })
  }
  return saveAssessment
}

function loadBasketThunk(title, template) {
  const collection = template ? 'mental-templates' : 'mental-assessments'
  return function (dispatch) {
    dispatch(fetchRequest({ type: FETCH_ASSESSMENT }))
    db.collection(collection)
      .doc(title)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data())
          dispatch(fetchSuccess({ data: doc.data(), type: FETCH_ASSESSMENT }))
          dispatch(setBasket({ questions: doc.data().questions }))
          console.log('Document successfully loaded!')
        } else {
          // doc.data() will be undefined in this case
          dispatch(
            fetchFailure({
              error: 'Aucun document trouvé ',
              type: FETCH_ASSESSMENT,
            }),
          )
          console.log('No such document!')
        }
      })
      .catch(function (error) {
        //dispatch(fetchFailure({ error }))
        console.error('Error loading document: ', error)
      })
  }
}

function loadAssessmentsThunk(template) {
  const collection = template ? 'mental-templates' : 'mental-assessments'
  return function (dispatch) {
    dispatch(fetchRequest({ type: FETCH_ASSESSMENTS }))
    db.collection(collection)
      .get()
      .then(function (querySnapshot) {
        const datas = []
        querySnapshot.forEach(function (doc) {
          datas.push({ ...doc.data(), title: doc.id })
          console.log(doc.id, ' => ', doc.data())
        })
        dispatch(fetchSuccess({ data: datas, type: FETCH_ASSESSMENTS }))
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
        // dispatch(fetchFailure({ error }))
      })
  }
}

function loadClassesThunk() {
  return function (dispatch) {
    dispatch(fetchRequest({ type: FETCH_CLASSES }))
    db.collection('classes')
      .get()
      .then(function (querySnapshot) {
        const datas = []
        querySnapshot.forEach(function (doc) {
          datas.push({ ...doc.data(), id: doc.id })
          console.log(doc.id, ' => ', doc.data())
        })
        dispatch(fetchSuccess({ data: datas, type: FETCH_CLASSES }))
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
        //dispatch(fetchFailure({ error }))
      })
  }
}

export {
  saveBasketThunk,
  loadAssessmentsThunk,
  loadBasketThunk,
  loadClassesThunk,
}

export default mentalSlice.reducer
