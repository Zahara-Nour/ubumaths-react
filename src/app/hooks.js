import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'

import {
  fetchDb,
  fetchSuccess,
  fetchFailure,
  FETCH_TYPES,
  setCollection,
  selectCollection,
  update,
  fetchRemove,
} from 'features/db/dbSlice'
import {
  fetchAssessments,
  fetchStudents,
  fetchCollection,
  listenCollection,
} from '../features/db/db'

import { compareArrays } from './utils'

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

const useAssessments = ({ type, saved }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [data, setData] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_ASSESSMENTS }))
      try {
        const result = await fetchAssessments(user, type)

        setData(result)
        dispatch(
          fetchSuccess({
            data: result,
            type: FETCH_TYPES.FETCH_ASSESSMENTS,
            key,
          }),
        )
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }
    fetchData()
  }, [dispatch, type, user, saved])
  return [data, isLoading, isError]
}

const useStudents = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [data, setData] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_STUDENTS }))
      try {
        const result = await fetchStudents(user)
        setData(result)
        dispatch(
          fetchSuccess({ data: result, type: FETCH_TYPES.FETCH_STUDENTS, key }),
        )
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }
    fetchData()
  }, [dispatch, user])
  return [data, isLoading, isError]
}

const useFilters = (filters = []) => {
  const namesRef = useRef([])
  const valuesRef = useRef([])
  const filtersRef = useRef(filters)
  const names = filters.map((filter) => Object.getOwnPropertyNames(filter)[0])
  const values = filters.map((filter, index) => filter[names[index]])

  if (
    compareArrays(names, namesRef.current) &&
    compareArrays(values, valuesRef.current)
  ) {
    // console.log('current filters', filtersRef.current)
    return filtersRef.current
  } else {
    namesRef.current = names
    valuesRef.current = values
    filtersRef.current = filters
    // console.log('new filters', filters)
    return filters
  }
}

const useCollection = ({
  path,
  filters = [],
  listen = false,
  extract,
  sort,
}) => {
  const emptyFilters = useMemo(()=>[],[])
  if (!filters) filters = emptyFilters
  filters = useFilters(filters)
  const dispatch = useDispatch()
  const emptyCollection = useMemo(() => [], [])
  const pathArray = useMemo(() => path.split('/'), [path])
  const collection = useMemo(() => pathArray[pathArray.length - 1], [pathArray])
  const type = useMemo(() => FETCH_TYPES['FETCH_' + collection.toUpperCase()], [
    collection,
  ])

  const documents = useSelector(selectCollection(path, filters))
  const documentFoundInState = !!documents
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleUpdate = useCallback(
    (key, type) => {
      let init = true
      return (data) => {
        if (data.length === 0) data = emptyCollection
        if (init) {
          init = false
          if (!documentFoundInState) {
            console.log(`--fetch success for ${path} : `,data)
            dispatch(fetchSuccess({ data, type, key }))
            dispatch(setCollection({ path, documents: data, filters }))
            setIsLoading(false)
          }
        } else {
          dispatch(update({ data, type }))
          dispatch(setCollection({ path, documents: data, filters }))
        }
      }
    },
    [path, dispatch, filters, emptyCollection, documentFoundInState],
  )

  // console.log('\n*** useCollection', path)
  // console.log('filters', filters)

  // if (documents) console.log('documents successfully found in state', documents)

  // const report = useWhatChanged(`useCollection ${path}`, {
  //   documents,
  //   collection,
  //   emptyCollection,
  //   filters,
  //   handleUpdate,
  //   listen,
  //   dispatch,
  //   type,
  //   path,
  //   documentFoundInState,
  //   isLoading,

  // })
  // console.log('***********')

  useEffect(() => {
    if (
      listen &&
      !(
        filters &&
        filters.find((filter) => !filter[Object.getOwnPropertyNames(filter)[0]])
      ) &&
      path
    ) {
      console.log(`--listening ${path}`, filters)
      let key
      if (!documentFoundInState) {
        setIsError(false)
        setIsLoading(true)
        console.log(`--fetching ${path}`)
        key = dispatch(fetchDb({ type }))
      }
      let unsubscribe = () => {}
      try {
        unsubscribe = listenCollection({
          path,
          filters,
          onChange: handleUpdate(key, type),
        })
      } catch (error) {
        setIsError(error.message)
        setIsLoading(false)
        dispatch(fetchFailure({ error: error.message, key, type }))
      }
      return () => {
        //in case component is unmount before fetch is fullfilled : remove in queue
        console.log(`--unlistening ${path}`)
        dispatch(fetchRemove({ key, type }))
        unsubscribe()
      }
    }
  }, [
    filters,
    handleUpdate,
    listen,
    dispatch,
    type,
    path,
    documentFoundInState,
  ])

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type }))
      try {
        let result = await fetchCollection({ path, filters })
        if (result.length === 0) result = emptyCollection
        // console.log(`result ${collection}`, result)

        dispatch(fetchSuccess({ data: result, type, key }))
        dispatch(setCollection({ path, documents: result, filters }))
        setIsLoading(false)
      } catch (error) {
        console.error(`error fetching ${path}`, error.message)
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
        setIsLoading(false)
      }
      return () => {
        //in case component is unmount before fetch is fullfilled : remove in queue
        dispatch(fetchRemove({ key, type }))
      }
    }

    if (
      !listen &&
      !documents &&
      !(
        filters &&
        filters.find((filter) => !filter[Object.getOwnPropertyNames(filter)[0]])
      ) &&
      path
    ) {
      // console.log(`fetch ${collection}`)
      fetchData()
    }
  }, [
    dispatch,
    documents,
    filters,
    listen,
    collection,
    type,
    path,
    emptyCollection,
    extract,
  ])

  const treatedDocuments = useMemo(() => {
    let returnedDocument = documents || []
    if (sort) returnedDocument = returnedDocument.slice().sort(sort)
    if (extract) {
      returnedDocument = returnedDocument.map((doc) => doc[extract])
    }
    return returnedDocument
  }, [documents, sort, extract])

  return [treatedDocuments, isLoading, isError]
}

let cachedScripts = []
function useScript(src) {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    loaded: false,
    error: false,
  })

  useEffect(
    () => {
      // If cachedScripts array already includes src that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (cachedScripts.includes(src)) {
        setState({
          loaded: true,
          error: false,
        })
      } else {
        cachedScripts.push(src)

        // Create script
        let script = document.createElement('script')
        script.src = src
        script.async = true

        // Script event listener callbacks for load and error
        const onScriptLoad = () => {
          setState({
            loaded: true,
            error: false,
          })
        }

        const onScriptError = () => {
          // Remove from cachedScripts we can try loading again
          const index = cachedScripts.indexOf(src)
          if (index >= 0) cachedScripts.splice(index, 1)
          script.remove()

          setState({
            loaded: true,
            error: true,
          })
        }

        script.addEventListener('load', onScriptLoad)
        script.addEventListener('error', onScriptError)

        // Add script to document body
        document.body.appendChild(script)

        // Remove event listeners on cleanup
        return () => {
          script.removeEventListener('load', onScriptLoad)
          script.removeEventListener('error', onScriptError)
        }
      }
    },
    [src], // Only re-run effect if script src changes
  )

  return [state.loaded, state.error]
}

function useWhatChanged(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.

  // console.log('//// useWhatChanged   -------')
  const previousProps = useRef()
  let report
  if (previousProps.current) {
    // Get all keys from previous and current props
    const allKeys = Object.keys({ ...previousProps.current, ...props })
    // Use this object to keep track of changed props
    const changesObj = {}
    // Iterate through keys
    allKeys.forEach((key) => {
      // If previous is different from current
      if (previousProps.current[key] !== props[key]) {
        // Add to changesObj
        changesObj[key] = {
          from: previousProps.current[key],
          to: props[key],
        }
      }
    })

    // If changesObj not empty then output to console

    if (Object.keys(changesObj).length) {
      console.log('[why-did-you-update]', name, changesObj)
      report = `[why-did-you-update] ${name} ${JSON.stringify(
        changesObj,
        null,
        2,
      )}`
    }
  }

  // Finally update previousProps with current props for next hook call
  previousProps.current = props
  // console.log('------ useWhatChanged   /////')
  return report
}

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export {
  useInterval,
  useAssessments,
  useStudents,
  useScript,
  useCollection,
  useFilters,
  useWhatChanged,
  useDebounce
}
