import React, { useState, useEffect, useRef } from 'react'
import Tabs from 'react-bulma-components/lib/components/tabs'
import Menu from 'react-bulma-components/lib/components/menu'
import Button from 'react-bulma-components/lib/components/button'
import Level from 'react-bulma-components/lib/components/level'
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import questions from '../../assets/questions'
import { addToBasket, launchAssessment, setBasket } from '../mental/mentalSlice'
import Description from './Description'
import NumberSelect from 'components/NumberSelect'
import { unstable_trace as trace } from 'scheduler/tracing'
import { selectUser } from 'features/auth/authSlice'

function QuestionsList() {
  const user = useSelector(selectUser)
  const [categoryId, setCategoryId] = useState(0)
  const [subcategoryId, setSubcategoryId] = useState(0)
  const [subsubcategoryId, setSubsubcategoryId] = useState(0)
  const [nbQuestions, setNbQuestions] = useState(1)

  const [level, setLevel] = useState(0)
  const dispatch = useDispatch()

  const category = questions[categoryId]
  const subcategories = questions[categoryId].subcategories
  const subcategory = subcategories[subcategoryId]
  const subsubcategories = subcategories[subcategoryId].subsubcategories
  const subsubcategory = subsubcategories[subsubcategoryId]
  const levels = subsubcategory.levels

  const [question, setQuestion] = useState({
    ...levels[level],
    category: category.label,
    subcategory: subcategory.label,
    subsubcategory: subsubcategory.label,
  })
  const [delay, setDelay] = useState(question.defaultDelay)

  console.log('level :' + level)
  console.log(question.description)

  useEffect(() => {
    console.log('useEffect')
    setQuestion({
      ...levels[level],
      category: category.label,
      subcategory: subcategory.label,
      subsubcategory: subsubcategory.label,
    })
    setDelay(question.defaultDelay)
  }, [
    category,
    subcategory,
    subsubcategory,
    level,
    levels,
    question.defaultDelay,
  ])

  const handleClickSubcategory = (sindex) => {
    setSubsubcategoryId(0)
    setSubcategoryId(sindex)
    setNbQuestions(1)
    setLevel(0)
  }

  const handleClickSubsubcategory = (ssindex) => {
    if (subsubcategoryId !== ssindex) {
      setSubsubcategoryId(ssindex)
      setNbQuestions(1)
      setLevel(0)
    }
  }

  return (
    <>
      <Tabs>
        {questions.map((category, index) => {
          return (
            <Tabs.Tab
              key={'category' + index}
              active={categoryId === index}
              onClick={() => {
                setSubsubcategoryId(0)
                setSubcategoryId(0)
                setCategoryId(index)
                setNbQuestions(1)
                setLevel(0)
              }}
            >
              <strong>{category.label}</strong>
            </Tabs.Tab>
          )
        })}
      </Tabs>

      <Menu>
        <Menu.List>
          {subcategories.map((subcategory, sindex) => {
            const sactive = subcategoryId === sindex
            return (
              <Menu.List.Item
                key={'subcategory' + sindex}
                onClick={() => handleClickSubcategory(sindex)}
              >
                <Menu.List title={subcategory.label.toUpperCase()}>
                  {sactive &&
                    subcategory.subsubcategories.map(
                      (subsubcategory, ssindex) => {
                        const ssactive = subsubcategoryId === ssindex
                        console.log('rendering subsubcategory' + ssindex)
                        return (
                          <Menu.List.Item
                            key={'subsubcategory' + ssindex}
                            active={ssactive}
                            onClick={() => handleClickSubsubcategory(ssindex)}
                          >
                            <Level renderAs="div">
                              <Level.Side align="left">
                                <Level.Item
                                  style={
                                    ssactive
                                      ? { color: 'white' }
                                      : { color: 'blue' }
                                  }
                                >
                                  {subsubcategory.label}
                                </Level.Item>
                                {ssactive && (
                                  <Level.Item>
                                    <Description question={question} />
                                  </Level.Item>
                                )}

                                {ssactive && levels.length > 1 && (
                                  <Level.Item>
                                    <Button.Group>
                                      {levels.map((q, index) => {
                                        return (
                                          <Button
                                            key={'button level' + index}
                                            size="small"
                                            color={
                                              level === index ? 'primary' : ''
                                            }
                                            onClick={(e) => {
                                              console.log(
                                                'click : doing setlevel',
                                              )
                                              e.stopPropagation()
                                              trace(
                                                'level',
                                                performance.now(),
                                                () => setLevel(index),
                                              )
                                            }}
                                          >
                                            {index + 1}
                                          </Button>
                                        )
                                      })}
                                    </Button.Group>
                                  </Level.Item>
                                )}
                                {ssactive && (
                                  <Level.Item>
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                      }}
                                    >
                                      <NumberSelect
                                        name="Délais"
                                        value={delay}
                                        onClick={setDelay}
                                      />
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
                                {ssactive && (
                                  <Level.Item>
                                    <Button
                                      color="link"
                                      onClick={() => {
                                        const questions = []
                                        for (let i = 0; i < nbQuestions; i++) {
                                          questions.push({
                                            ...question,
                                            delay: parseInt(delay, 10) * 1000,
                                          })
                                        }
                                        dispatch(addToBasket({ questions }))
                                      }}
                                    >
                                      {user.role === 'teacher' && <FontAwesomeIcon icon={faCartArrowDown} />}
                                    </Button>
                                  </Level.Item>
                                )}
                                {ssactive && (
                                  <Level.Item>
                                    <Button
                                      color="link"
                                      onClick={() => {
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
                                      }}
                                    >
                                      Go !
                                    </Button>
                                  </Level.Item>
                                )}
                              </Level.Side>
                            </Level>
                          </Menu.List.Item>
                        )
                      },
                    )}
                </Menu.List>
              </Menu.List.Item>
            )
          })}
        </Menu.List>
      </Menu>
    </>
  )
}

export default QuestionsList
