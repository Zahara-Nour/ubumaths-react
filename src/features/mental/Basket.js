import React from 'react'
import List from 'react-bulma-components/lib/components/list'
import Heading from 'react-bulma-components/lib/components/heading'
import Level from 'react-bulma-components/lib/components/level'
import Button from 'react-bulma-components/lib/components/button'
import { selectRawQuestions, removeFromBasket, setBasket } from './mentalSlice'
import { useSelector, useDispatch } from 'react-redux'
import ButtonModalSaveBasket from './ButtonModalSaveBasket'
import ButtonModalLoadBasket from './ButtonModalLoadBasket'
import { math } from 'tinycas/build/math/math'

function Basket() {
  const questions = useSelector(selectRawQuestions)
  const dispatch = useDispatch()



  return (
    <>
      <Heading>Panier</Heading>
      <Level>
        <Level.Item>
          <ButtonModalSaveBasket questions={questions} />
        </Level.Item>
        <Level.Item>
          <ButtonModalLoadBasket />
        </Level.Item>
        <Level.Item>
          <Button
            color="link"
            onClick={() => dispatch(setBasket({ questions: [] }))}
          >
            Vider
          </Button>
        </Level.Item>
      </Level>

      <List hoverable>
        {questions.map((question, index) => {
          return (
            <List.Item
              key={'question' + index}
              onClick={() => {
                dispatch(removeFromBasket({ index }))
              }}
              align="center"
            >
              {
                math(
                  question.expressions[
                    Math.floor(Math.random() * question.expressions.length)
                  ],
                ).generate().string
              }
            </List.Item>
          )
        })}
      </List>
    </>
  )
}

export default Basket
