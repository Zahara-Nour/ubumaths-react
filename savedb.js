const firestoreService = require('firestore-export-import')
const serviceAccount = require('./private/firebase-service-account.json')

const fs = require('fs')

// Initiate Firebase App
// appName is optional, you can omit it.

firestoreService.initializeApp(
  serviceAccount,
  'https://mathereal-1586176000451.firebaseio.com',
  '[DEFAULT]',
)

const collections=['FlashCards', 'Globals','Users','Schools', 'Templates']

const savedDb = {}

collections.forEach(collection=>{
  firestoreService
  .backup(collection)
  .then((data) => {
    console.log('*** '+collection+' ***')
    savedDb[collection]=data
    const json = JSON.stringify(savedDb, null, 2)
    console.log('db',json)
    fs.writeFile('db.json', json, function (err) {
      if (err) {
        console.log(err)
      }
    })
    
  })
  .catch((error) => console.log('error', error))
})


