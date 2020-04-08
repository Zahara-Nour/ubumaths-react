import React from 'react'
import CorrectionItem from './CorrectionItem'
import List from 'react-bulma-components/lib/components/list'
import Columns from 'react-bulma-components/lib/components/columns'
import Section from 'react-bulma-components/lib/components/section'
import Heading from 'react-bulma-components/lib/components/heading'
import Container from 'react-bulma-components/lib/components/container'
import Hero from 'react-bulma-components/lib/components/hero'
import max from '../../assets/img/max.svg'

export default function Correction({ questions }) {
 
  return (
    <>
        <Hero color="primary">
          <Hero.Body>
            <Container>
              <Heading>Correction</Heading>
            </Container>
          </Hero.Body>
        </Hero>
      <Section>
      <Columns>
        <Columns.Column size={3}>
          <img src={max} alt="Max" />
        </Columns.Column>
        <Columns.Column size={9}>
          <List hoverable>
            {questions.map((question, index) => (
              <CorrectionItem key={index} question={question} number={index+1} />
            ))}
          </List>
        </Columns.Column>
      </Columns>
      </Section>
      </>
  )
}
