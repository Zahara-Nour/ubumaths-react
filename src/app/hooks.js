import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'
import { shuffle } from 'app/utils'
import {
  fetchDb,
  FETCH_ASSESSMENTS,
  fetchSuccess,
  fetchFailure,
  FETCH_STUDENTS,
  FETCH_CARDS,
  FETCH_THEMES,
  FETCH_DOMAINS,
  FETCH_SUBJECTS,
  FETCH_GRADES,
  selectSubjects,
  setSubjects,
  selectThemes,
  selectDomains,
  setThemes,
  setDomains,
  selectGrades,
  setGrades,
  selectCardslevels,
  FETCH_CARDS_LEVELS,
  addCardsLevels,
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
} from './db'

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

      const key = dispatch(fetchDb({ type: FETCH_ASSESSMENTS }))
      try {
        const result = await fetchAssessments(user, type)

        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_ASSESSMENTS, key }))
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

      const key = dispatch(fetchDb({ type: FETCH_STUDENTS }))
      try {
        const result = await fetchStudents(user)
        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_STUDENTS, key }))
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

      const key = dispatch(fetchDb({ type: FETCH_GRADES }))
      try {
        const result = await fetchGrades()
        if (result.length !== 0) {
          setData(result)
          dispatch(fetchSuccess({ data: result, type: FETCH_GRADES, key }))
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

const useCards = (subject, domain, theme, level) => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      const key = dispatch(fetchDb({ type: FETCH_CARDS}))
      try {
        const result = await fetchCards(subject, domain, theme, level)
        shuffle(result)
        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_CARDS, key }))
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }
    fetchData()
  }, [dispatch, theme, domain, subject, level])

  // return [shuffle(data.slice()), isLoading, isError]

  return [data, isLoading, isError]
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
    

      const key = dispatch(fetchDb({ type: FETCH_CARDS_LEVELS }))
      try {
        const result = await fetchCardsLevels(subject, domain)
        dispatch(fetchSuccess({ data: result, type: FETCH_CARDS_LEVELS, key }))
        if (result.length >0) {
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

  // return [shuffle(data.slice()), isLoading, isError]

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
      const key = dispatch(fetchDb({ type: FETCH_THEMES }))
      try {
        let result = await fetchThemes(subject, domain)
        if (result.length > 0 && grade) {
          result = result.filter((theme) => theme.grade === grade)
        }
        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_THEMES, key }))
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

      const key = dispatch(fetchDb({ type: FETCH_DOMAINS }))
      try {
        const result = await fetchDomains(subject)
        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_DOMAINS, key }))
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

      const key = dispatch(fetchDb({ type: FETCH_SUBJECTS }))
      try {
        const result = await fetchSubjects()
        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_SUBJECTS, key }))
        dispatch(setSubjects({ subjects: result }))
      } catch (error) {
        setIsError(error.message)
        dispatch(fetchFailure({ error: error.message, key }))
      }
      setIsLoading(false)
    }

    if ( subjects.length === 0) {
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
}
