import React, { useState, memo } from 'react'
import Menu from 'react-bulma-components/lib/components/menu'
import Subsubcategory from './Subsubcategory'

export default memo(function Subcategory({ subcategory, active, onClick }) {
  const [subsubcategoryId, setSubsubcategoryId] = useState(0)
  const handleClickSubsubcategory = (index) => {
      
    if (subsubcategoryId !== index) {
      setSubsubcategoryId(index)
      console.log("new subsubcategoryId "+ subsubcategoryId)
    }
  }

  return (
    <Menu.List.Item onClick={onClick}>
      {active ? 
      <Menu.List title={subcategory.label.toUpperCase()}>
        
          {subcategory.subsubcategories.map((subsubcategory, ssindex) => {
            const ssactive = subsubcategoryId === ssindex
            console.log('rendering subsubcategory' + ssindex)
            return (
              <Subsubcategory
                subsubcategory={subsubcategory}
                active={ssactive}
                onClick={() => handleClickSubsubcategory(ssindex)}
                key={ssindex.toString()}
               
              />
            )
          })}
      </Menu.List>
      : subcategory.label.toUpperCase()}
    </Menu.List.Item>
  )
})
