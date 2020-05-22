import { createSlice } from '@reduxjs/toolkit'
import { math } from 'tinycas/build/math/math'
import db from '../db/db'
import {
  saveRequest,
  saveSuccess,
  saveFailure,
  fetchRequest,
  fetchSuccess,
  fetchFailure,
  FETCH_TYPES
} from 'features/db/dbSlice'

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
  ready: false,
  finished: false,
  answers: [],
  marked: false,
  assessmentId: '',
}

const mentalSlice = createSlice({
  name: 'mental',
  initialState: initialState,
  reducers: {
    launchAssessment(state, action) {
      state.generatedQuestions = generateQuestions(state.rawQuestions)
      state.ready = true
      state.marked = action.payload.marked
      state.assessmentId = action.payload.assessmentId
      state.answers = []
    },

    assessmentFinished(state, action) {
      state.finished = true
      state.answers = action.payload.answers
    },

    correctionFinished(state, action) {
      state.ready = false
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
  },
})

export const {
  launchAssessment,
  assessmentFinished,
  correctionFinished,
  prepareQuestions,
  addToBasket,
  removeFromBasket,
  setBasket,
} = mentalSlice.actions

const selectReady = (state) => state.mental.ready
const selectMarked = (state) => state.mental.marked
const selectAnswers = (state) => state.mental.answers
const selectFinished = (state) => state.mental.finished
const selectAssessmentId = (state) => state.mental.assessmentId
const selectRawQuestions = (state) => state.mental.rawQuestions
const selectGeneratedQuestions = (state) => state.mental.generatedQuestions

export {
  selectReady,
  selectFinished,
  selectAnswers,
  selectMarked,
  selectAssessmentId,
  selectRawQuestions,
  selectGeneratedQuestions,
}

function saveMarkAsync(userId, assessmentId, mark) {
  return function (dispatch) {
    db.collection('Users')
      .doc(userId)
      .collection('Assessments')
      .doc(assessmentId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log('got document')
          const data = doc.data()
          data.best = data.best > mark ? data.best : mark
          data.results = data.results.concat({
            mark,
            timestamp: new Date().getTime(),
          })
          return data
        } else {
          console.log('No such document!')
        }
      })
      .then((data) => {
        console.log('trying to save')
        db.collection('Users')
          .doc(userId)
          .collection('Assessments')
          .doc(assessmentId)
          .set(data)
          .then(() => console.log('Note enregisrée pour ' + userId))
      })
      .catch((error) => console.error('Error writing document: ', error.message))
  }
}

function saveBasket(user, questions, title, type, oneShot, students) {
  let collectionRef

  return (dispatch) => {
    dispatch(saveRequest())
    switch (type) {
      case 'Modèle global':
        collectionRef = db.collection('Templates')
        break
      case 'Modèle':
        collectionRef = db
          .collection('Users')
          .doc(user.email)
          .collection('Templates')
        break
      default:
        collectionRef = db
          .collection('Users')
          .doc(user.email)
          .collection('Assessments')
    }

    const assignAssessment = () => {
      students.forEach((student) => {
        db.collection('Users')
          .doc(student)
          .collection('Assessments')
          .doc(title)
          .set({ title, results: [], best: 0, done:false })
          .then(() =>
            console.log('Evaluation ' + title + ' enregisrée pour ' + student),
          )
          .catch((error) => {
            console.error('Error writing document: ', error.message)
            throw error
          })
      })
    }

    const saveAssessment = () => {
      dispatch(saveRequest())
      collectionRef
        .doc(title)
        .set({ title, questions, oneShot })
        .then(() => {
          if (type === 'Evaluation') assignAssessment()
        })
        .then(dispatch(saveSuccess()))
        .catch(function (error) {
          dispatch(saveFailure({ error }))
          console.error('Error writing document: ', error.message)
        })
    }
    saveAssessment()
  }
}

function loadBasket(userId, id, type) {
  let collectionRef
  switch (type) {
    case 'Modèle global':
      collectionRef = db.collection('Templates')
      break
    case 'Modèle':
      collectionRef = db
        .collection('Users')
        .doc(userId)
        .collection('Templates')
      break
    default:
      collectionRef = db
        .collection('Users')
        .doc(userId)
        .collection('Assessments')
  }
  return function (dispatch) {
    dispatch(fetchRequest({ type: FETCH_TYPES.FETCH_ASSESSMENT }))

    return collectionRef
      .doc(id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
   
          dispatch(fetchSuccess({ data: doc.data(), type: FETCH_TYPES.FETCH_ASSESSMENT }))
          dispatch(setBasket({ questions: doc.data().questions }))
          console.log('Document successfully loaded!')
        } else {
          // doc.data() will be undefined in this case
          dispatch(
            fetchFailure({
              error: 'Aucun document trouvé ',
              type: FETCH_TYPES.FETCH_ASSESSMENT,
            }),
          )
          console.log('No such document!')
        }
      })
      .catch(function (error) {
        dispatch(fetchFailure({ error }))
        console.error('Error loading document: ', error)
      })
  }
}

function loadAssignedAssessmentsAsync({ userId }) {
  return function (dispatch) {
    dispatch(fetchRequest({ type: FETCH_TYPES.FETCH_ASSIGNED_ASSESSMENTS }))
    db.collection('Users')
      .doc(userId)
      .collection('assessments')
      .get()
      .then(function (querySnapshot) {
        const datas = []
        querySnapshot.forEach(function (doc) {
          datas.push({ ...doc.data(), title: doc.id })
    
        })
        dispatch(
          fetchSuccess({ data: datas, type: FETCH_TYPES.FETCH_ASSIGNED_ASSESSMENTS }),
        )
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
        // dispatch(fetchFailure({ error }))
      })
  }
}



function fetchClasses(user) {
  return (dispatch) => {
    dispatch(fetchRequest({ type: FETCH_TYPES.FETCH_CLASSES }))
    db.collection('Users')
      .doc(user.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          dispatch(
            fetchSuccess({ data: doc.data().classes, type: FETCH_TYPES.FETCH_CLASSES }),
          )
        } else {
          dispatch(fetchFailure(`${user.email} doesn't exist`))
        }
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
        dispatch(fetchFailure({ error }))
      })
  }
}

export {
  // fetchAssessments,
  saveBasket,
  saveMarkAsync,
  loadBasket,
  fetchClasses,
  loadAssignedAssessmentsAsync,
}

export default mentalSlice.reducer
