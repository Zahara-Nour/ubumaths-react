import React, { useState } from 'react'
import Tabs from 'react-bulma-components/lib/components/tabs'
import Menu from 'react-bulma-components/lib/components/menu'

import questions from '../../assets/questions'

import Subcategory from './Subcategory'

function QuestionsList() {
  const [categoryId, setCategoryId] = useState(0)
  const [subcategoryId, setSubcategoryId] = useState(0)

  const subcategories = questions[categoryId].subcategories

  const handleClickCategory = (index) => {
    setCategoryId(index)
    setSubcategoryId(0)
  }

  const handleClickSubcategory = (index) => {
    setSubcategoryId(index)
  }

  return (
    <>
      <Tabs>
        {questions.map((category, index) => {
          return (
            <Tabs.Tab
              active={categoryId === index}
              key={index.toString()}
              onClick={() => handleClickCategory(index)}
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
              <Subcategory
                key={sindex.toString()}
                subcategory={subcategory}
                active={sactive}
                onClick={() => handleClickSubcategory(sindex)}
              />
            )
          })}
        </Menu.List>
      </Menu>
    </>
  )
}

export default QuestionsList
