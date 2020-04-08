import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Assessment from './Assessment'
import Basket from './Basket'
import Columns from 'react-bulma-components/lib/components/columns'
import Button from 'react-bulma-components/lib/components/button'
import Box from 'react-bulma-components/lib/components/box'
import Section from 'react-bulma-components/lib/components/section'
import Heading from 'react-bulma-components/lib/components/heading'
import Container from 'react-bulma-components/lib/components/container'
import Hero from 'react-bulma-components/lib/components/hero'
import { launchAssessment } from './mentalSlice'
import { selectReady } from './mentalSlice'
import QuestionsList from './QuestionsList'

function Mental() {
  const dispatch = useDispatch()
  const ready = useSelector(selectReady)

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
          <Section>
            <Box>
              <QuestionsList />
            </Box>
          </Section>
        </Columns.Column>
        <Columns.Column size={4}>
          <Section>
            <Button
              color="primary"
              onClick={() => dispatch(launchAssessment())}
            >
              Go daddy !
            </Button>
          </Section>
          <Section>
            <Box>
              <Basket />
            </Box>
          </Section>
        </Columns.Column>
      </Columns>
    </>
  )
}

export default Mental
