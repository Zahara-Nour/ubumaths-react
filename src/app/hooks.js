import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'

import {
  fetchDb,
  fetchSuccess,
  fetchFailure,
 
  selectSubjects,
  setSubjects,
  selectThemes,
  selectDomains,
  setThemes,
  setDomains,
  selectGrades,
  setGrades,
  selectCardslevels,
  addCardsLevels,
  FETCH_TYPES,
  setCollection,
  selectCollection,
  update,
  fetchRemove,
} from 'features/db/dbSlice'
import {
  fetchAssessments,
  fetchStudents,
  fetchCards,
  fetchSubjects,
  fetchDomains,
  fetchThemes,
  fetchGrades,
  fetchCardsLevels,
  listenCards,
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

const useGrades = () => {
  const grades = useSelector(selectGrades)
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_GRADES }))
      try {
        const result = await fetchGrades()
        if (result.length !== 0) {
          setData(result)
          dispatch(
            fetchSuccess({ data: result, type: FETCH_TYPES.FETCH_GRADES, key }),
          )
          dispatch(setGrades({ grades: result }))
        } else {
          throw new Error('Grades list is empty')
        }
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }
    if (grades.length === 0) {
      fetchData()
    } else {
      setData(grades)
    }
  }, [dispatch, grades])

  return [data, isLoading, isError]
}

const useCards = ({ subject, domain, theme, level, listen }) => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_CARDS }))
      try {
        let result = await fetchCards(subject, domain, theme, level)
        setData(result)
        dispatch(
          fetchSuccess({ data: result, type: FETCH_TYPES.FETCH_CARDS, key }),
        )
        setFetched(true)
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }
    fetchData()
  }, [dispatch, theme, domain, subject, level])

  useEffect(() => {
    let unsubscribe = () => {}
    if (fetched && listen) {
      unsubscribe = listenCards(subject, domain, theme, level, setData)
    }
    return unsubscribe
  }, [subject, domain, theme, level, fetched, listen])

  return [data, isLoading, isError]
}

const useFilters = (filters=[]) => {
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

const useCollection = ({ path, filters = [], listen = false }) => {
  // filters = useFilters(filters)
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

  // console.log('*** collection', path)

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
  //   isListening,
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
      let key
      if (!documentFoundInState) {
        setIsError(false)
        setIsLoading(true)

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
      return  () => {
        //in case component is unmount before fetch is fullfilled : remove in queue
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
        dispatch(setCollection({ collection, documents: result, filters }))
        setIsLoading(false)
      } catch (error) {
        console.error(`error fetching ${collection}`, error.message)
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
        setIsLoading(false)
      }
      return  () => {
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
  ])

  return [documents || emptyCollection, isLoading, isError]
}

const useCardsLevels = (subject, domain) => {
  const cardLevels = useSelector(selectCardslevels)

  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_CARDS_LEVELS }))
      try {
        const result = await fetchCardsLevels(subject, domain)
        dispatch(
          fetchSuccess({
            data: result,
            type: FETCH_TYPES.FETCH_CARDS_LEVELS,
            key,
          }),
        )
        if (result.length > 0) {
          setData(result)
          dispatch(addCardsLevels({ cardsLevels: result }))
        }
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }

    if (
      domain &&
      subject &&
      !cardLevels.find(
        (card) => card.subject === subject && card.domain === domain,
      )
    ) {
      fetchData()
    } else {
      setData(cardLevels)
    }
  }, [dispatch, domain, subject, cardLevels])

  return [data, isLoading, isError]
}

const useThemes = (subject, domain, grade) => {
  const themes = useSelector(selectThemes(subject, domain))
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)
      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_THEMES }))
      try {
        let result = await fetchThemes(subject, domain)
        if (result.length > 0 && grade) {
          result = result.filter((theme) => theme.grade === grade)
        }
        setData(result)
        dispatch(
          fetchSuccess({ data: result, type: FETCH_TYPES.FETCH_THEMES, key }),
        )
        dispatch(setThemes({ themes: result, subject, domain }))
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }
    if (!themes && subject && domain) {
      fetchData()
    } else if (themes) {
      setData(themes)
    }
  }, [dispatch, themes, domain, subject, grade])

  return [data, isLoading, isError]
}

const useDomains = (subject) => {
  const domains = useSelector(selectDomains(subject))
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_DOMAINS }))
      try {
        const result = await fetchDomains(subject)
        setData(result)
        dispatch(
          fetchSuccess({ data: result, type: FETCH_TYPES.FETCH_DOMAINS, key }),
        )
        dispatch(setDomains({ domains: result, subject }))
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }
    if (!domains && subject) {
      fetchData()
    } else if (domains) {
      setData(domains)
    }
  }, [dispatch, domains, subject])

  return [data, isLoading, isError]
}

const useSubjects = () => {
  const subjects = useSelector(selectSubjects)
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_TYPES.FETCH_SUBJECTS }))
      try {
        const result = await fetchSubjects()
        setData(result)
        dispatch(
          fetchSuccess({ data: result, type: FETCH_TYPES.FETCH_SUBJECTS, key }),
        )
        dispatch(setSubjects({ subjects: result }))
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }

    if (subjects.length === 0) {
      fetchData()
    } else {
      setData(subjects)
    }
  }, [dispatch, subjects])

  return [data, isLoading, isError]
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

  console.log('//// useWhatChanged   -------')
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
  console.log('------ useWhatChanged   /////')
  return report
}

export {
  useSubjects,
  useThemes,
  useDomains,
  useInterval,
  useAssessments,
  useStudents,
  useScript,
  useCards,
  useGrades,
  useCardsLevels,
  useCollection,
  useFilters,
  useWhatChanged,
}
