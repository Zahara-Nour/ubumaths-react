import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Assessment from './Assessment'
import Basket from './Basket'
import Columns from 'react-bulma-components/lib/components/columns'
import Button from 'react-bulma-components/lib/components/button'
import Box from 'react-bulma-components/lib/components/box'

import Heading from 'react-bulma-components/lib/components/heading'
import Container from 'react-bulma-components/lib/components/container'
import Hero from 'react-bulma-components/lib/components/hero'
import { launchAssessment } from './mentalSlice'
import { selectReady } from './mentalSlice'
import QuestionsList from './QuestionsList'
import { selectUser } from 'features/auth/authSlice'



function Mental() {
  const dispatch = useDispatch()
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
          {user.role === 'teacher' && (
            <Button
              fullwidth
              color="primary"
              onClick={() => dispatch(launchAssessment())}
            >
              Go daddy !
            </Button>
          )}

          {user.role === 'teacher' && (
            <Box>
              <Basket />
            </Box>
          )}
        </Columns.Column>
      </Columns>
    </>
  )
}

export default Mental
