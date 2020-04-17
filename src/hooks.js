import { useEffect, useRef } from 'react'

function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
    //   console.log('tick', savedCallback.current)
      savedCallback.current()
    }
    if (delay !== null) {
    //   console.log('setting interval', savedCallback.current)
      let id = setInterval(tick, delay)
      return () => {
        // console.log('clearing interval', savedCallback.current)
        clearInterval(id)
      }
    }
  }, [delay])
}

export { useInterval }
