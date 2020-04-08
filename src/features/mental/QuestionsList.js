import React, { useState } from 'react'
import categories from '../../assets/questions'
import Params from './Params'
import Columns from 'react-bulma-components/lib/components/columns'
import Tabs from 'react-bulma-components/lib/components/tabs'
import Menu from 'react-bulma-components/lib/components/menu'

function QuestionsList() {
  const [categoryId, setCategoryId] = useState(0)
  const [subcategoryId, setSubcategoryId] = useState(0)
  const [subsubcategoryId, setSubsubcategoryId] = useState(0)

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
                      }}
                    >
                      <Menu.List title={subcategory.label}>
                        {subcategory.subsubcategories.map(
                          (subsubcategory, ssindex) => {
                            return (
                              <Menu.List.Item
                                hidden={subcategoryId !== sindex}
                                key={'subsubcategory' + ssindex}
                                active={subsubcategoryId === ssindex}
                                onClick={() => {
                                  setSubsubcategoryId(ssindex)
                                }}
                              >
                                {subsubcategory.label}
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
          <Params
            categoryId={categoryId}
            subcategoryId={subcategoryId}
            subsubcategoryId={subsubcategoryId}
          />
        </Columns.Column>
      </Columns>
    </>
  )
}

export default QuestionsList
