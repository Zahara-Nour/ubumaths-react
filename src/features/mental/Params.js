import React, { useState, useEffect } from 'react'
import {
  Field,
  Control,
  Label,
  Input,
} from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'
import Content from 'react-bulma-components/lib/components/content'
import { addToBasket } from '../mental/mentalSlice'
import questions from '../../assets/questions'
import { math } from 'tinycas/build/math/math'
import { useDispatch } from 'react-redux'

function Params({ categoryId, subcategoryId, subsubcategoryId }) {
  const [nbQuestions, setNbQuestions] = useState(1)
  const [delay, setDelay] = useState(1000)
  const [level, setLevel] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    setLevel(0)
  }, [categoryId, subsubcategoryId, subcategoryId])

  const levels =
    questions[categoryId].subcategories[subcategoryId].subsubcategories[
      subsubcategoryId
    ].levels 
    
  const question = {
    ...levels[level],
    category: questions[categoryId].label,
    subcategory: questions[categoryId].subcategories[subcategoryId].label,
    subsubcategory:
      questions[categoryId].subcategories[subcategoryId].subsubcategories[
        subsubcategoryId
      ].label,
  }

  return question ? (
    <>
      <Field>
        <Content>
          <div
            dangerouslySetInnerHTML={{
              __html:
                question.description +
                '<br><strong>Exemple:</strong> ' +
                math(question.expression).generate().string,
            }}
          />
        </Content>
      </Field>

      <Field>
        <Label>Niveau</Label>
        <Button.Group>
          {levels.map((q, index) => {
            return (
              <Control key={'button' + index}>
                <Button
                  color={level === index ? 'primary' : ''}
                  onClick={() => {
                    setLevel(index)
                  }}
                >
                  {index + 1}
                </Button>
              </Control>
            )
          })}
        </Button.Group>
      </Field>

      <Field>
        <Label>Délai</Label>
        <Control>
          <Input
            onChange={(evt) => setDelay(evt.target.value)}
            name="delay"
            type="number"
            placeholder="0"
            value={delay}
          />
        </Control>
      </Field>

      <Field>
        <Label>Nombre d'utilisation</Label>
        <Control>
          <Input
            onChange={(evt) => setNbQuestions(evt.target.value)}
            name="number"
            type="number"
            placeholder="10"
            value={nbQuestions}
          />
        </Control>
      </Field>
      <Field>
        <Button
          color="primary"
          onClick={() => {
            for (let i = 0; i < nbQuestions; i++) {
              dispatch(
                addToBasket({
                  question: {
                    ...question,
                    delay: parseInt(delay, 10) * 1000,
                  },
                }),
              )
            }
          }}
        >
          Ajouter
        </Button>
      </Field>
    </>
  ) : (
    <div />
  )
}

export default Params
