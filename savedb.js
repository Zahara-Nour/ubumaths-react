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
// Start exporting your data
// firestoreService

const promises = []

collections.forEach(collection=>{
  firestoreService
  .backup(collection)
  .then((data) => {
    console.log('*** '+collection+' ***')
    // const json = JSON.stringify(data, null, 2)
    // console.log(json)
    savedDb[collection]=data
    
    const json = JSON.stringify(savedDb, null, 2)
    console.log('db',json)
    fs.writeFile('test.txt', json, function (err) {
      if (err) {
        console.log(err)
      }
    })
    
  })
  .catch((error) => console.log('error', error))
})

// Promise.all(promises).then(()=> {
//   const json = JSON.stringify(savedDb, null, 2)
//   fs.writeFile('test.txt', json, function (err) {
//     if (err) {
//       console.log(err)
//     }
//   })
// })


// firestoreService
//   .backups([]) // Array of collection's name is OPTIONAL
//   .then((collections) => {
//     // You can do whatever you want with collections
//     console.log(JSON.stringify(collections))
//   })


