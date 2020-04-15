import React from 'react'
import { useSelector } from 'react-redux'
import Assessment from './Assessment'
import Basket from './Basket'
import Columns from 'react-bulma-components/lib/components/columns'

import Box from 'react-bulma-components/lib/components/box'

import Heading from 'react-bulma-components/lib/components/heading'
import Container from 'react-bulma-components/lib/components/container'
import Hero from 'react-bulma-components/lib/components/hero'

import { selectReady } from './mentalSlice'
import QuestionsList from './QuestionsList'
import { selectUser } from 'features/auth/authSlice'
import AssignedAssessments from './AssignedAssessments'

function Mental() {
 
  const ready = useSelector(selectReady)
  const user = useSelector(selectUser)

  if (ready) return <Assessment />

  return (
    <>
      <Hero color="primary">
        <Hero.Body>
          <Container>
            <Heading>Calcul mental</Heading>
          </Container>
        </Hero.Body>
      </Hero>

      <Columns>
        <Columns.Column size={8}>
          <Box>
            <QuestionsList />
          </Box>
        </Columns.Column>

        <Columns.Column size={4}>
          {user.role === 'teacher' && <Basket />}

          {user.role === 'student' && (
            <AssignedAssessments userId={user.email} />
          )}
        </Columns.Column>
      </Columns>
    </>
  )
}

export default Mental
