import firebase from 'firebase/app'
import 'firebase/firestore'
import { saveAs } from 'file-saver'
import { lexicoSort } from 'app/utils'

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

const fetchCollection = ({ path, filters }) => {
  // console.log('dbfetch path', path)
  // console.log('dbfetch filters', filters)
  const pathArray = path.split('/')
  let documents = []
  let collectionRef = db.collection(pathArray.shift())
  while (pathArray.length > 0) {
    collectionRef = collectionRef
      .doc(pathArray.shift())
      .collection(pathArray.shift())
  }

  filters.forEach((filter) => {
    const name = Object.getOwnPropertyNames(filter)[0]
    const value = filter[name]
    collectionRef = collectionRef.where(name, '==', value)
  })

  return collectionRef
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id })
      })
      documents.sort((a, b) => lexicoSort(a.name, b.name))
      console.log(`fetch successful in collection ${path}`, documents, filters)
      return documents
    })
    .catch((error) =>
      console.error(`Error while fetching collection ${path} `, error),
    )
}

const listenCollection = ({ path, filters, onChange }) => {
  // console.log('listenCollection',path.join('/'))
  // console.log('path', path)
  const pathArray = path.split('/')

  let collectionRef = db.collection(pathArray.shift())
  while (pathArray.length > 0) {
    collectionRef = collectionRef
      .doc(pathArray.shift())
      .collection(pathArray.shift())
  }

  // console.log('collection set')
  filters.forEach((filter) => {
    const name = Object.getOwnPropertyNames(filter)[0]
    const value = filter[name]
    collectionRef = collectionRef.where(name, '==', value)
  })

  // console.log('filters set')

  const unsubscribe = collectionRef.onSnapshot(
    (docs) => {
      const documents = []
      // console.log('docs',docs)
      docs.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id })
      })
      documents.sort((a, b) => lexicoSort(a.name, b.name))
      // console.log(
      //   `Listen successful in collection ${path.join('/')}`,
      //   documents,
      // )
      onChange(documents)
    },
    (error) =>
      console.error(`Error while listening collection ${path} : `, error),
  )
  return unsubscribe
}

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

function saveCard(card) {
  if (card.id) {
    const { id, ...rest } = card
    return db
      .collection('FlashCards')
      .doc(id)
      .set(rest)
      .catch((error) =>
        console.error(`Error while saving card n° ${id}`, error.message),
      )
  } else
    return db
      .collection('FlashCards')
      .doc()
      .set(card)
      .catch((error) => console.error(`Error while saving card`, error))
}

function createDocument({ path, document }) {
  const pathArray = path.split('/')
  let collectionRef = db.collection(pathArray.shift())
  while (pathArray.length > 0) {
    collectionRef = collectionRef
      .doc(pathArray.shift())
      .collection(pathArray.shift())
  }

  if (document.id) {
    const { id, ...rest } = document
    return collectionRef
      .doc(id)
      .set(rest)
      .then(() =>
        console.log(
          `Document ${id} successfully added in collection ${path}`,
          rest,
        ),
      )
      .catch((error) =>
        console.error(
          `Error while saving document ${id} in collection ${path}`,
          error,
        ),
      )
  } else {
    const doc = collectionRef.doc()
    return doc
      .set(document)
      .then(() =>
        console
          .log(
            `Document ${doc.id} successfully added in collection ${path}`,
            document,
          )
          .catch((error) =>
            console.error(
              `Error while saving document ${doc.id} in collection ${path}`,
              error,
            ),
          ),
      )
  }
}

// document must have an id field
function saveDocument({ path, document }) {
  path = path.split('/')
  const collection = path[path.length - 1]
  let collectionRef = db.collection(path.shift())
  while (path.length > 0) {
    collectionRef = collectionRef.doc(path.shift()).collection(path.shift())
  }

  const { id, ...rest } = document
  return collectionRef
    .doc(id)
    .update(rest)
    .then(() =>
      console.log(`Document ${id} successfully updated in ${collection}`, rest),
    )
    .catch((error) =>
      console.error(
        `Error while updating document ${id} in ${collection}`,
        error,
      ),
    )
}

function fetchDocument({ path, id }) {
  path = path.split('/')
  const collection = path[path.length - 1]
  let collectionRef = db.collection(path.shift())
  while (path.length > 0) {
    collectionRef = collectionRef.doc(path.shift()).collection(path.shift())
  }

  return collectionRef
    .doc(id)
    .get()
    .then(() => `Document ${id} successfully updated in ${collection}`)
    .catch((error) =>
      console.log(
        `Error while saving document in ${collection}`,
        error.message,
      ),
    )
}

export {
  saveCard,
  fetchAssessments,
  fetchStudents,
  fetchCollection,
  listenCollection,
  createDocument,
  saveDocument,
  fetchDocument,
}
export default db
