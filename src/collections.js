import { collections } from './stores'
import { get } from 'svelte/store'
import { fetchCollection } from './db'
import { getPropertyName } from './utils'



  export async function getCollection({collectionPath, filters=[], thenCallback, extract, sort}) {
    
    //  check in store
    const store = get(collections)
   
    let values = store[collectionPath]
    let promise

    for (let i = 0; values && i < filters.length; i++) {
      const filter = filters[i]
      const filterName = getPropertyName(filter)
      const filterValue = filter[filterName]
      values = values[filterValue]
    }

    if (values && values.collection) {
      promise=Promise.resolve(values.collection)
    }

    // else fetch
    else promise =  fetchCollection({
      path: collectionPath,
      filters,
    }).then((documents) => {
     
        if (extract) documents = documents.map((value) => value[extract])
        if (sort) documents = documents.sort(sort)
      // updating store
      collections.update((store) => {
        if (!store[collectionPath]) {
          store[collectionPath] = {}
        }
        let nested = store[collectionPath]

        filters.forEach((filter) => {
          const filterName = getPropertyName(filter)
          const filterValue = filter[filterName]
          if (!nested[filterValue]) nested[filterValue] = {}
          nested = nested[filterValue]
        })
        
        
        nested.collection = documents
        return store
      })
      return documents

    })
  
    promise = promise.then(values=> {
    
        if (thenCallback) thenCallback(values)
        return values})

    return promise
  }