import React, { useState } from 'react'
import categories from '../../assets/questions'

import Columns from 'react-bulma-components/lib/components/columns'
import Tabs from 'react-bulma-components/lib/components/tabs'
import Menu from 'react-bulma-components/lib/components/menu'
import Button from 'react-bulma-components/lib/components/button'
import Content from 'react-bulma-components/lib/components/content'
import {
  Control,
  Input,
  Field,
  Label,
} from 'react-bulma-components/lib/components/form'
import Level from 'react-bulma-components/lib/components/level'
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import questions from '../../assets/questions'
import { math } from 'tinycas/build/math/math'
import { addToBasket } from '../mental/mentalSlice'

function QuestionsList() {
  const [categoryId, setCategoryId] = useState(0)
  const [subcategoryId, setSubcategoryId] = useState(0)
  const [subsubcategoryId, setSubsubcategoryId] = useState(0)
  const [nbQuestions, setNbQuestions] = useState(1)
  
  const [level, setLevel] = useState(0)
  const dispatch = useDispatch()


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

  const [delay, setDelay] = useState(question.defaultDelay)

  return (
    <>
      <Tabs>
        {categories.map((category, index) => {
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
              {category.label}
            </Tabs.Tab>
          )
        })}
      </Tabs>

      <Columns>
        <Columns.Column size={8}>
          <Menu>
            <Menu.List>
              {categories[categoryId].subcategories.map(
                (subcategory, sindex) => {
                  return (
                    <Menu.List.Item
                      key={'subcategory' + sindex}
                      active={subcategoryId === sindex}
                      onClick={() => {
                        setSubsubcategoryId(0)
                        setSubcategoryId(sindex)
                        setNbQuestions(1)
                        setLevel(0)
                      }}
                    >
                      <Menu.List title={subcategory.label}>
                        {subcategory.subsubcategories.map(
                          (subsubcategory, ssindex) => {
                            const active = subsubcategoryId === ssindex
                            return (
                              <Menu.List.Item
                                hidden={subcategoryId !== sindex}
                                key={'subsubcategory' + ssindex}
                                active={active}
                                onClick={() => {
                                  setSubsubcategoryId(ssindex)
                                }}
                              >
                                <Level renderAs="div">
                                  <Level.Side align="left">
                                    <Level.Item>
                                      {active ? (
                                        <strong>{subsubcategory.label}</strong>
                                      ) : (
                                        subsubcategory.label
                                      )}
                                    </Level.Item>
                                  </Level.Side>
                                  {active && (
                                    <Level.Side align="right">
                                      <Level.Item>
                                        <Input
                                          size="small"
                                          onChange={(evt) =>
                                            setNbQuestions(evt.target.value)
                                          }
                                          name="number"
                                          type="number"
                                          placeholder="10"
                                          value={nbQuestions}
                                        />
                                        <Button
                                          color="link"
                                          onClick={() => {
                                            for (
                                              let i = 0;
                                              i < nbQuestions;
                                              i++
                                            ) {
                                              dispatch(
                                                addToBasket({
                                                  question: {
                                                    ...question,
                                                    delay:
                                                      parseInt(delay, 10) *
                                                      1000,
                                                  },
                                                }),
                                              )
                                            }
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faCartArrowDown}
                                          />
                                        </Button>
                                      </Level.Item>
                                      <Level.Item></Level.Item>
                                    </Level.Side>
                                  )}
                                </Level>
                              </Menu.List.Item>
                            )
                          },
                        )}
                      </Menu.List>
                    </Menu.List.Item>
                  )
                },
              )}
            </Menu.List>
          </Menu>
        </Columns.Column>

        <Columns.Column size={4}>
          {question ? (
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
            </>
          ) : (
            <div />
          )}
        </Columns.Column>
      </Columns>
    </>
  )
}

export default QuestionsList
