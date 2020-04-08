import React from 'react'
import List from 'react-bulma-components/lib/components/list'
import Heading from 'react-bulma-components/lib/components/heading'
import Button from 'react-bulma-components/lib/components/button'
import Modal from 'react-bulma-components/lib/components/modal'
import Section from 'react-bulma-components/lib/components/section'
import OpenModal from '../../components/OpenModal'
import {selectRawQuestions, removeFromBasket} from './mentalSlice'
import { useSelector, useDispatch } from 'react-redux'

function Basket() {
  const questions = useSelector(selectRawQuestions)
  const dispatch = useDispatch()


  return (
    <>
      <Heading>Panier</Heading>
      <Button color="primary" onClick={() => {}}>
        Charger
      </Button>
      <Button color="primary" onClick={() => {}}>
        Sauvegarder
      </Button>
      <OpenModal modal={{ closeOnEsc: false }}>
        <Modal.Content>
          <Section style={{ backgroundColor: 'white' }}>
            Click on the {'"X"'} button on the top-right button to close the
            Modal (pass closeOnEsc=false to the modal to avoid closing it with
            the keyboard)
          </Section>
        </Modal.Content>
      </OpenModal>
      <List hoverable>
        {questions.map((question, index) => {
          return (
            <List.Item
              key={'question' + index}
              onClick={() => {
                dispatch(removeFromBasket({ index }))
              }}
            >
              {[
                question.category,
                question.subcategory,
                question.subsubcategory,
                question.level,
                question.expression,
              ].join(':')}
            </List.Item>
          )
        })}
      </List>
    </>
  )
}

export default Basket
