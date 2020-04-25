import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'
import {
  fetchRequest,
  FETCH_ASSESSMENTS,
  fetchSuccess,
  fetchFailure,
  FETCH_STUDENTS,
} from 'features/db/dbSlice'
import { fetchAssessments, fetchStudents } from './db'

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

const useAssessments = ({type, saved}) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [data, setData] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)
     
      dispatch(fetchRequest({ type: FETCH_ASSESSMENTS }))
      try {
        const result = await fetchAssessments(user, type)
  
        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_ASSESSMENTS }))
      } catch (error) {
        setIsError(true)
        dispatch(fetchFailure({ error }))
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
     
      dispatch(fetchRequest({ type: FETCH_STUDENTS }))
      try {
        const result = await fetchStudents(user)
        setData(result)
        dispatch(fetchSuccess({ data: result, type: FETCH_STUDENTS }))
      } catch (error) {
        setIsError(true)
        dispatch(fetchFailure({ error }))
      }
      setIsLoading(false)
    }
    fetchData()
  }, [dispatch, user])
  return [data, isLoading, isError]
}

export { useInterval, useAssessments, useStudents }
