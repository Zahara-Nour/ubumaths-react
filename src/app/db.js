import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAMnIlAk2yqGItw5EfTCLqj2SdJF6Q5620',
  authDomain: 'mathereal-1586176000451.firebaseapp.com',
  databaseURL: 'https://mathereal-1586176000451.firebaseio.com',
  projectId: 'mathereal-1586176000451',
  storageBucket: 'mathereal-1586176000451.appspot.com',
  messagingSenderId: '702572178697',
  appId: '1:702572178697:web:cb14e184230ff9ca8277d8',
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

function fetchAssessments(user, type) {
  let collectionRef

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

  return collectionRef.get().then((docs) => {
    const result = []
    docs.forEach((doc) => {
      result.push(doc.data())
    })
   
    return result
  })
}

function fetchStudents(user) {
  const students = {}
  user.classes.forEach((c) => {
    students[c] = []
  })

  return db
    .collection('Users')
    .where('school', '==', user.school)
    .where('role', '==', 'student')
    .where('class', 'in', user.classes)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        const student = doc.data()
        students[student.class].push(student)
      })
      return students
    })
}

export { fetchAssessments, fetchStudents }
export default db
