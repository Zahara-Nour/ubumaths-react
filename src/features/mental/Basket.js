import React from 'react'

import { selectRawQuestions, removeFromBasket, setBasket } from './mentalSlice'
import { useSelector, useDispatch } from 'react-redux'
// import ButtonModalSaveBasket from './ButtonModalSaveBasket'
// import ButtonModalLoadBasket from './ButtonModalLoadBasket'
import { math } from 'tinycas/build/math/math'
import { launchAssessment } from './mentalSlice'
import { List, ListItem } from '@material-ui/core'
import Button from 'components/CustomButtons/Button'
import ModalSave from './ModalSave'
import ModalLoad from './ModalLoad'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardBody from 'components/Card/CardBody'
import CardIcon from 'components/Card/CardIcon'
import {grayColor} from 'assets/jss/main-jss'

const flexContainerRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}

function Basket() {
  const questions = useSelector(selectRawQuestions)
  const dispatch = useDispatch()

  return (
    <Card>
      <CardHeader color='success' icon>
        <CardIcon color='success'>
          <ShoppingBasketIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        <List style={flexContainerRow}>
          <ListItem>
            <ModalSave  questions={questions} />
          </ListItem>
          <ListItem>
            <ModalLoad />
          </ListItem>
          <ListItem>
            <Button
              color='link'
              style={{
                backgroundColor:  grayColor[3],
              }}
              onClick={() => dispatch(setBasket({ questions: [] }))}
            >
              Vider
            </Button>
          </ListItem>
        </List>
        {questions.length > 0 ? (
          <>
          <List>
            {questions.map((question, index) => {
              return (
                <ListItem
                  style={{ justifyContent: 'center' }}
                  button
                  disableRipple
                  key={'question' + index}
                  onClick={() => {
                    dispatch(removeFromBasket({ index }))
                  }}
                >
                  {
                    math(
                      question.expressions[
                        Math.floor(Math.random() * question.expressions.length)
                      ],
                    ).generate().string
                  }
                </ListItem>
              )
            })}
          </List>
          <div style={{display:'flex',
          justifyContent:'center'}}>
           <Button
           fullwidth
           color='danger'
           style={{margin:'0 auto'}}
           onClick={() => dispatch(launchAssessment())}
         >
           Go daddy !
         </Button>
         </div>
         </>
        ) : (
          'Le panier est vide !'
        )}
      </CardBody>
    </Card>
  )

  // return (
  //   <Box>
  //     <Level>
  //       <Level.Item>
  //         <Heading size={4}>Panier</Heading>
  //       </Level.Item>
  //       <Level.Item>
  //         <Button
  //           fullwidth
  //           color="primary"
  //           onClick={() => dispatch(launchAssessment())}
  //         >
  //           Go daddy !
  //         </Button>
  //       </Level.Item>
  //     </Level>

  //     <Level>
  //       <Level.Item>
  //         <ButtonModalSaveBasket questions={questions} />
  //       </Level.Item>
  //       <Level.Item>
  //         <ButtonModalLoadBasket />
  //       </Level.Item>
  //       <Level.Item>
  //         <Button
  //           color="link"
  //           onClick={() => dispatch(setBasket({ questions: [] }))}
  //         >
  //           Vider
  //         </Button>
  //       </Level.Item>
  //     </Level>

  //   </Box>
  // )
}

export default Basket
