import React, { useState, memo } from 'react'
import Button from 'react-bulma-components/lib/components/button'
import Level from 'react-bulma-components/lib/components/level'
import Menu from 'react-bulma-components/lib/components/menu'
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addToBasket, launchAssessment, setBasket } from '../mental/mentalSlice'
import Description from './Description'
import NumberSelect from 'components/NumberSelect'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'


export default memo(function Subsubcategory({
  active,
  subsubcategory,
  onClick,
  name,
}) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [nbQuestions, setNbQuestions] = useState(1)
  const [level, setLevel] = useState(0)
  const levels = subsubcategory.levels

  const [question,setQuestion] = useState({
    ...levels[level],
  })

  const [delay, setDelay] = useState(question.defaultDelay)

  const handleClickLevel = (evt) => {
    const index = parseInt(evt.target.name, 10)
    console.log(evt.target.name)
    evt.stopPropagation()
    setLevel(index)
    setQuestion({...levels[index]})
  }

  const handleClickBasket = () => {
    const questions = []
    for (let i = 0; i < nbQuestions; i++) {
      questions.push({
        ...question,
        delay: parseInt(delay, 10) * 1000,
      })
    }
    dispatch(addToBasket({ questions }))
  }

  const handleClickGo = () => {
    const questions = []
    for (let i = 0; i < 10; i++) {
      questions.push({
        ...question,
        delay: parseInt(delay, 10) * 1000,
      })
    }
    dispatch(setBasket({ questions: [] }))
    dispatch(addToBasket({ questions }))
    dispatch(launchAssessment())
  }

  return (
    <Menu.List.Item active={active} onClick={onClick}>
      <Level renderAs="div">
        <Level.Side align="left">
          <Level.Item style={active ? { color: 'white' } : { color: 'blue' }}>
            {subsubcategory.label}
          </Level.Item>
          {active && (
            <Level.Item>
              <Description question={question} />
            </Level.Item>
          )}

          {active && levels.length > 1 && (
            <Level.Item>
              <Button.Group>
                {levels.map((q, index) => {
                  return (
                    <Button
                      key={index.toString()}
                      name={index.toString()}
                      size="small"
                      color={level === index ? 'primary' : ''}
                      onClick={handleClickLevel}
                    >
                      {index + 1}
                    </Button>
                  )
                })}
              </Button.Group>
            </Level.Item>
          )}

          {active && (
            <Level.Item>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <NumberSelect name="Délais" value={delay} onClick={setDelay} />
                {user.role === 'teacher' && (
                  <NumberSelect
                    name="Quantité"
                    value={nbQuestions}
                    onClick={setNbQuestions}
                  />
                )}
              </div>
            </Level.Item>
          )}
        </Level.Side>
        <Level.Side align="right">
          {active && (
            <Level.Item>
              <Button color="link" onClick={handleClickBasket}>
                {user.role === 'teacher' && (
                  <FontAwesomeIcon icon={faCartArrowDown} />
                )}
              </Button>
            </Level.Item>
          )}
          {active && (
            <Level.Item>
              <Button color="link" onClick={handleClickGo}>
                Go !
              </Button>
            </Level.Item>
          )}
        </Level.Side>
      </Level>
    </Menu.List.Item>
  )
})
