import React, { useState, useCallback } from 'react'
import CorrectionItem from './CorrectionItem'
import List from 'react-bulma-components/lib/components/list'
import Columns from 'react-bulma-components/lib/components/columns'
import Section from 'react-bulma-components/lib/components/section'
import Heading from 'react-bulma-components/lib/components/heading'
import Container from 'react-bulma-components/lib/components/container'
import Hero from 'react-bulma-components/lib/components/hero'
import max from '../../assets/img/max.svg'
import { useSelector } from 'react-redux'
import { selectAnswers } from './mentalSlice'
import Level from 'react-bulma-components/lib/components/level'

export default function Correction({ questions }) {
  const answers = useSelector(selectAnswers)
  const [score, setScore] = useState(0)
  const fontSize = 20

  const handleAddPoint = useCallback(() => setScore((s) => s + 1), [setScore])

  return (
    <>
      <Hero color='primary'>
        <Hero.Body>
          <Container>
            <Heading>Correction</Heading>
          </Container>
        </Hero.Body>
      </Hero>
      <Section>
        <Columns>
          <Columns.Column size={2}>
            <img src={max} alt='Max' />
            <Level>
              <Level.Side align='left' style={{fontSize}}>
                <Level.Item>
                  Score :
                </Level.Item>
                <Level.Item>
                {score} sur {questions.length}
                </Level.Item>
              </Level.Side>
            </Level>
          </Columns.Column>
          <Columns.Column size={10}>
            <List hoverable>
              {questions.map((question, index) => (
                <CorrectionItem
                  key={index}
                  question={question}
                  answer={answers[index]}
                  number={index + 1}
                  addPoint={handleAddPoint}
                />
              ))}
            </List>
          </Columns.Column>
        </Columns>
      </Section>
    </>
  )
}
