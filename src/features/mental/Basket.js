import React from 'react'
import List from 'react-bulma-components/lib/components/list'
import Heading from 'react-bulma-components/lib/components/heading'
import { selectRawQuestions, removeFromBasket } from './mentalSlice'
import { useSelector, useDispatch } from 'react-redux'
import ButtonModalSaveBasket from '../../components/ButtonModalSaveBasket'
import { math } from 'tinycas/build/math/math'

function Basket() {
  const questions = useSelector(selectRawQuestions)
  const dispatch = useDispatch()

  return (
    <>
      <Heading>Panier</Heading>

      <ButtonModalSaveBasket questions={questions} />
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
              {math(question.expression).generate().string}
            </List.Item>
          )
        })}
      </List>
    </>
  )
}

export default Basket
