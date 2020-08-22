import {images} from './stores'
import { storage } from './db'
import { getLogger } from './utils'
import {get} from 'svelte/store'

const { trace } = getLogger('FlashCards', 'trace')

export const getLocalUrl = async (imgPath) => {
  const store = get(images)

  if (store[imgPath]) {
    return store[imgPath]
  }

  return storage
    .child(imgPath)
    .getDownloadURL()
    .then((url) => {
      const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = () => {
          trace('img dowloadeed', imgPath)
          const blob = xhr.response
          const localUrl = URL.createObjectURL(blob)
          images.update((store) => {
            store[imgPath] = localUrl
            return store
          })
          resolve(localUrl)
        }
        xhr.onerror = () => {
          reject()
        }
        xhr.open('GET', url)
        xhr.send()
      })
      return promise
    })
    .catch((err) => error('error while fetching image :', err.message))
}
