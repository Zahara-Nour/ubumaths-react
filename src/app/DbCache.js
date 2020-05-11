import React from 'react'
import { useSubjects, useGrades } from './hooks'

function DbCache() {
    useSubjects()
    useGrades()

    return null
}

export default DbCache