import React, { useState, useEffect, useRef } from 'react'
import Button from 'react-bulma-components/lib/components/button'
import Modal from 'react-bulma-components/lib/components/modal'
import Level from 'react-bulma-components/lib/components/level'
import Notification from 'react-bulma-components/lib/components/notification'
import Loader from 'react-bulma-components/lib/components/loader'
import {
  Control,
  Input,
  Field,
  Label,
  Radio,
  Help,
} from 'react-bulma-components/lib/components/form'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectSaving,
  saveBasketThunk,
  saveReset,
  selectSaved,
  selectSaveError,
  selectFetched,
  FETCH_CLASSES,
  loadClassesThunk,
} from 'features/mental/mentalSlice'

import AssessmentsList from 'features/mental/AssessmentsList'
import ScrollArea from '@xico2k/react-scroll-area'
import ChooseClasses from './ChooseClasses'
import ChooseStudents from './ChooseStudents'

export default function ButtonModalSaveBasket({ questions }) {
  const dispatch = useDispatch()
 
  const [title, setTitle] = useState('Titre')
  const [show, setShow] = useState(false)
  const [radioValue, setRadioValue] = useState('Modèle')
  const [titleExists, setTitleExists] = useState(false)
  const titles = useRef([])
  const saving = useSelector(selectSaving)
  const saved = useSelector(selectSaved)
  const saveError = useSelector(selectSaveError)
  const open = () => setShow(true)
  const close = () => {
    if (!saving) {
      setShow(false)
      dispatch(saveReset())
      setTitle('Titre')
    }
  }
  const classes = useSelector(selectFetched(FETCH_CLASSES)) || []
  const [selectedClasses, setSelectedClasses] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])

  const radioOnChange = (evt) => setRadioValue(evt.target.value)

  useEffect(() => setTitleExists(titles.current.includes(title)), [title])
  useEffect(() => {
    if (radioValue === 'Evaluation') {
      dispatch(loadClassesThunk())
    }
  }, [radioValue, dispatch])

  return (
    <>
      <Button color="link" onClick={open}>
        Sauvegarder
      </Button>

      <Modal show={show} onClose={close} closeOnBlur>
        <Modal.Card onClose={close}>
          <Modal.Card.Head onClose={close}>
            <Modal.Card.Title>Sauvegarder</Modal.Card.Title>
          </Modal.Card.Head>

          <Modal.Card.Body>
            <Field>
              <Label>Titre de l'évaluation</Label>
              <Control>
                <Input
                  color={title === '' || titleExists ? 'danger' : null}
                  placeholder="Titre"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {title === '' && <Help color="danger">Entrez un titre !</Help>}
                {titleExists && (
                  <Help color="danger">
                    Cet enregistrement existe déjà ! Vous allez l'écraser !!!
                  </Help>
                )}
              </Control>
            </Field>
            <Level>
              <Level.Side align="left">
                <Level.Item>
                  <Button
                    disabled={saving}
                    color="link"
                    onClick={() => {
                      dispatch(
                        saveBasketThunk({
                          questions,
                          title,
                          template: radioValue === 'Modèle',
                          classes: selectedClasses,
                          students: selectedStudents,
                        }),
                      )
                    }}
                  >
                    Sauvegarder
                  </Button>
                </Level.Item>
                {saving && <Loader />}
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
            {saved && (
              <Notification
                color="success"
                onClick={() => dispatch(saveReset())}
              >
                Enregistrement réussi !
              </Notification>
            )}
            {saveError && (
              <Notification
                color="danger"
                onClick={() => dispatch(saveReset())}
              >
                L'enregistrement à échoué !{saveError}
              </Notification>
            )}

            {radioValue === 'Evaluation' && (
              <Level>
                <Level.Side align="left">
                  <Level.Item>
                    <ChooseClasses
                      classes={classes}
                      selected={selectedClasses}
                      onChange={setSelectedClasses}
                    />
                  </Level.Item>
                  <Level.Item>
                    <ChooseStudents
                      classes={classes}
                      selected={selectedStudents}
                      onChange={setSelectedStudents}
                    />
                  </Level.Item>
                </Level.Side>
              </Level>
            )}
          </Modal.Card.Body>

          <Modal.Card.Foot
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <ScrollArea height="300px">
              <AssessmentsList
                template={radioValue === 'Modèle'}
                clickCB={setTitle}
                loadCB={(t) => (titles.current = t)}
              />
            </ScrollArea>
          </Modal.Card.Foot>
        </Modal.Card>
      </Modal>
    </>
  )
}
