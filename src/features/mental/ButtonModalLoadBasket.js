import React, { useState } from 'react'
import Button from 'react-bulma-components/lib/components/button'
import Modal from 'react-bulma-components/lib/components/modal'
import Level from 'react-bulma-components/lib/components/level'
import Notification from 'react-bulma-components/lib/components/notification'
import Loader from 'react-bulma-components/lib/components/loader'
import { Control, Radio } from 'react-bulma-components/lib/components/form'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectFetching,
  fetchReset,
  selectFetchError,
  selectFetched,
  FETCH_ASSESSMENT,
} from 'features/db/dbSlice'
import { loadBasketThunk } from 'features/mental/mentalSlice'
import AssessmentsList from 'features/mental/AssessmentsList'
// import ScrollArea from '@xico2k/react-scroll-area'


export default function ButtonModalLoadBasket() {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [radioValue, setRadioValue] = useState('Modèle')
  const radioOnChange = (evt) => setRadioValue(evt.target.value)
  const fetched = useSelector(selectFetched(FETCH_ASSESSMENT))
  const fetching = useSelector(selectFetching(FETCH_ASSESSMENT))
  const fetchError = useSelector(selectFetchError(FETCH_ASSESSMENT))
  const open = () => setShow(true)
  const close = () => {
    if (!fetching) {
      dispatch(fetchReset({ type: FETCH_ASSESSMENT }))
      setShow(false)
    }
  }
  const text = 'Charger'
  const [title, setTitle] = useState('')

  return (
    <>
      <Button color="link" onClick={open}>
        {text}
      </Button>

      <Modal show={show} onClose={close} closeOnBlur>
        <Modal.Card onClose={close}>
          <Modal.Card.Head onClose={close}>
            <Modal.Card.Title>{text}</Modal.Card.Title>
          </Modal.Card.Head>

          <Modal.Card.Body>
            <Level>
              <Level.Side align="left">
                <Level.Item>
                  <Button
                    disabled={!!fetching || !title}
                    color="link"
                    onClick={() =>
                      dispatch(loadBasketThunk(title, radioValue === 'Modèle'))
                    }
                  >
                    {text}
                  </Button>
                </Level.Item>
                <Level.Item>{title}</Level.Item>
                {fetching === 'Assessment' && (
                  <Level.Item>
                    <Loader />
                  </Level.Item>
                )}
              </Level.Side>
              <Level.Side align="right">
                <Level.Item>
                  <Control>
                    <Radio
                      onChange={radioOnChange}
                      checked={radioValue === 'Modèle'}
                      value="Modèle"
                      name="type"
                    >
                      Modèle
                    </Radio>
                    <Radio
                      onChange={radioOnChange}
                      checked={radioValue === 'Evaluation'}
                      value="Evaluation"
                      name="type"
                    >
                      Evaluation
                    </Radio>
                  </Control>
                </Level.Item>
              </Level.Side>
            </Level>
            {fetched && (
              <Notification
                color="success"
                onClick={() => dispatch(fetchReset({ type: FETCH_ASSESSMENT }))}
              >
                Chargement réussi !
              </Notification>
            )}
            {fetchError && (
              <Notification
                color="danger"
                onClick={() => dispatch(fetchReset({ type: FETCH_ASSESSMENT }))}
              >
                Le chargement a échoué !{fetchError}
              </Notification>
            )}
          </Modal.Card.Body>

          <Modal.Card.Foot
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            {/* <ScrollArea height="300px"> */}
              <AssessmentsList
                template={radioValue === 'Modèle'}
                clickCB={setTitle}
              />
            {/* </ScrollArea> */}
          </Modal.Card.Foot>
        </Modal.Card>
      </Modal>
    </>
  )
}
