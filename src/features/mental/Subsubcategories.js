import React, { useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Subsubcategory from './Subsubcategory'
import { warningColor } from 'assets/jss/main-jss'
import { makeStyles } from '@material-ui/core'

const styles = {
  subsubcategory: {
    '&.Mui-selected, &.Mui-selected:hover': {
      background:
        'linear-gradient(-60deg, ' +
        warningColor[5] +
        ', ' +
        warningColor[6] +
        ')',
    },

    borderRadius: 10,
  },
}
const useStyles = makeStyles(styles)

function Subsubcategories({subsubcategories}) {
  const classes = useStyles()
  const [subsubcategoryId, setSubsubcategoryId] = useState(0)
  
  const handleClickSubsubcategory = (id) => {
    setSubsubcategoryId(id)
  }

  return (
    <List>
      {subsubcategories.map((subsubcategory, index) => (
        <ListItem
          className={classes.subsubcategory}
          key={index}
          button
          disableRipple
          selected={subsubcategoryId === index}
          onClick={() => handleClickSubsubcategory(index)}
          onMouseDown={(e) => e.stopPropagation()} // workaround : https://github.com/mui-org/material-ui/issues/5104#issuecomment-521976038
        >
          <Subsubcategory
            subsubcategory={subsubcategory}
            active={subsubcategoryId === index}
          />
        </ListItem>
      ))}
    </List>
  )
}

export default Subsubcategories
