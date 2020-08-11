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

import { compareArrays, shuffle, getLogger, lexicoSort } from './utils'

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
  const { trace, debug } = getLogger('useFilters')

  const namesRef = useRef([])
  const valuesRef = useRef([])
  const filtersRef = useRef(filters)
  const names = filters.map((filter) => Object.getOwnPropertyNames(filter)[0])
  const values = filters.map((filter, index) => filter[names[index]])

  if (
    compareArrays(names, namesRef.current) &&
    compareArrays(values, valuesRef.current)
  ) {
    return filtersRef.current
  } else {
    debug('new filters', filters, '\n')
    namesRef.current = names
    valuesRef.current = values
    filtersRef.current = filters
    return filters
  }
}

const useCollection = (props) => {
  const {
    path,
    filters: filtersProp = [],
    listen = false,
    extract,
    sort,
    shuffling = false,
    newElement,
  } = props

  const { error, info, trace, debug } = getLogger(
    `useCollection ${path}`,
    
  )
  const emptyFilters = useMemo(() => [], [])
  trace(`>>>>>>>>>> `)
  trace('call useFilter with :', filtersProp || emptyFilters, '\n')
  const filters = useFilters(filtersProp || emptyFilters)

  const dispatch = useDispatch()
  const emptyCollection = useMemo(() => [], [])
  const pathArray = useMemo(() => path.split('/'), [path])
  const collection = useMemo(() => pathArray[pathArray.length - 1], [pathArray])
  const type = useMemo(() => FETCH_TYPES['FETCH_' + collection.toUpperCase()], [
    collection,
  ])

  const documents = useSelector(selectCollection(path, filters))
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const state = { documents, isLoading, isError }
  useWhyRendered(`useCollection ${path}`, props, state)

  const handleUpdate = useCallback(
    (type) => (data) => {
      if (data.length === 0) data = emptyCollection

      info(`[**] received ${path} :`, data, 'filters', filters)
      dispatch(update({ data, type }))
      dispatch(setCollection({ path, documents: data, filters }))
    },
    [path, dispatch, filters, emptyCollection, info],
  )

  useEffect(() => {
    if (
      listen &&
      !(
        filters &&
        filters.find((filter) => !filter[Object.getOwnPropertyNames(filter)[0]])
      ) &&
      path
    ) {
      info(`[**] listening with filters :`, filters)

      setIsError(false)
      let unsubscribe = () => {}
      try {
        unsubscribe = listenCollection({
          path,
          filters,
          onChange: handleUpdate(type),
        })
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, type }))
      }
      return () => {
        info(`[**] unlistening`)
        unsubscribe()
      }
    }
  }, [filters, handleUpdate, listen, dispatch, type, path, info])

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type }))
      try {
        let result = await fetchCollection({ path, filters })
        if (result.length === 0) result = emptyCollection

        dispatch(fetchSuccess({ data: result, type, key }))
        dispatch(setCollection({ path, documents: result, filters }))
        setIsLoading(false)
      } catch (err) {
        setIsError(err.message)
        dispatch(fetchFailure({ error: err.message, key }))
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
      fetchData()
    } else {
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
    error,
    info,
    trace,
  ])

  const defaultSort = (a, b) => lexicoSort(a.name, b.name)

  const treatedDocuments = useMemo(() => {

    if (!documents) return null

    let returned =
      !documents.length && newElement
        ? [
            {
              ...newElement,
              ...filters.reduce((acc, current) => ({ ...acc, ...current }), {}),
            },
          ]
        : documents
  
   
    returned = returned.slice().sort(sort || defaultSort)
   
    if (shuffling) returned = shuffle([...returned])
    if (extract) {
      returned = returned.map((doc) => doc[extract])
    }
    return returned
  }, [documents, sort, extract, shuffling, newElement, filters])

  debug('returns documents :', treatedDocuments, 'filters', filters)
  trace(`<<<<<<<<<<<< `)
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

function useWhyRendered(name, props, state) {
  const { trace } = getLogger(name + ' rendered ')
  const previousProps = useRef()
  const previousState = useRef()
  const propsChanges = {}
  const stateChanges = {}

  if (previousProps.current) {
    const allKeys = Object.keys({ ...previousProps.current, ...props })

    allKeys.forEach((key) => {
      if (previousProps.current[key] !== props[key]) {
        propsChanges[key] = {
          from: previousProps.current[key],
          to: props[key],
        }
      }
    })
  }

  if (previousState.current) {
    const allKeys = Object.keys({ ...previousState.current, ...state })

    allKeys.forEach((key) => {
      if (previousState.current[key] !== state[key]) {
        stateChanges[key] = {
          from: previousState.current[key],
          to: state[key],
        }
      }
    })
  }
  if (!previousProps.current) {
    trace(`first time`)
  } else if (Object.keys(stateChanges).length) {
    trace(`with state changed :`, stateChanges)
  } else if (Object.keys(propsChanges).length) {
    trace(`by parent with new props :`, propsChanges)
  } else {
    trace(`by parent`)
  }

  previousProps.current = props
  previousState.current = state
}

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay], // Only re-call effect if value or delay changes
  )

  return debouncedValue
}

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export {
  useInterval,
  useAssessments,
  useStudents,
  useScript,
  useCollection,
  useFilters,
  useWhyRendered,
  useDebounce,
  usePrevious
}
