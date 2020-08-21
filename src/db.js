import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { getLogger } from './utils'


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
const storage = firebase.storage().ref()

function fetchCollection({ path, filters }) {
  const { error, info, trace } = getLogger('fetchCollection', 'trace')
  trace(`  fetching ${path} with filters :`, filters)
 

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
      //   info(`  fetched ${path} :`, documents)
      return documents
    })
    .catch((err) => console.log(err))
}

export { fetchCollection, storage, db }
