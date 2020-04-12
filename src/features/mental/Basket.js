import React from 'react'
import List from 'react-bulma-components/lib/components/list'
import Heading from 'react-bulma-components/lib/components/heading'
import Level from 'react-bulma-components/lib/components/level'
import Button from 'react-bulma-components/lib/components/button'
import Box from 'react-bulma-components/lib/components/box'
import { selectRawQuestions, removeFromBasket, setBasket } from './mentalSlice'
import { useSelector, useDispatch } from 'react-redux'
import ButtonModalSaveBasket from './ButtonModalSaveBasket'
import ButtonModalLoadBasket from './ButtonModalLoadBasket'
import { math } from 'tinycas/build/math/math'
import { launchAssessment } from './mentalSlice'

function Basket() {
  const questions = useSelector(selectRawQuestions)
  const dispatch = useDispatch()

  return (
    <Box>
      <Level>
        <Level.Item>
          <Heading size={4}>Panier</Heading>
        </Level.Item>
        <Level.Item>
          <Button
            fullwidth
            color="primary"
            onClick={() => dispatch(launchAssessment())}
          >
            Go daddy !
          </Button>
        </Level.Item>
      </Level>

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
      {questions.length > 0 ? (
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
                <Level>
                  <Level.Side >
                    <Level.Item>
                    {
                  math(
                    question.expressions[
                      Math.floor(Math.random() * question.expressions.length)
                    ],
                  ).generate().string
                }
                    </Level.Item>
                  </Level.Side>
                </Level>
                
              </List.Item>
            )
          })}
        </List>
      ) : (
        <Level>
          <Level.Item>Le panier est vide !</Level.Item>
        </Level>
      )}
    </Box>
  )
}

export default Basket
