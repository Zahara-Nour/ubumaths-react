import React, { useState } from 'react'

import questions from './questions.json'
import NavPills from 'components/NavPills/NavPills.js'
import Accordion from 'components/Accordion/Accordion'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Subsubcategory from './Subsubcategory'
//import Subcategory from './Subcategory'
import SettingsIcon from '@material-ui/icons/Settings'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import { warningColor } from 'assets/jss/main-jss'
import { makeStyles } from '@material-ui/core'

const styles = {
  subsubcategory: {
    '&.Mui-selected, &.Mui-selected:hover': {
      background: "linear-gradient(-60deg, " + warningColor[5] + ", " + warningColor[6] + ")",
    },

    borderRadius: 10,
  },
}
const useStyles = makeStyles(styles)

function QuestionsList() {
  const classes = useStyles()

  const [subsubcategoryId, setSubsubcategoryId] = useState(0)
  const [level, setLevel] = useState(0)

  const handleClickCategory = () => {
    setLevel(0)
    setSubsubcategoryId(0)
  }

  const handleClickSubcategory = () => {
    setSubsubcategoryId(0)
    setLevel(0)
  }
  const handleClickSubsubcategory = (id) => {
    setSubsubcategoryId(id)
    setLevel(0)
  }

  return (
    <Card>
      <CardHeader color='success' icon>
        <CardIcon color='success'>
          <SettingsIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        <NavPills
          onChange={handleClickCategory}
          color='warning'
          tabs={questions.map((category, index) => ({
            tabButton: category.label,
            tabContent: (
              <Accordion
                onChange={handleClickSubcategory}
                key={index}
                active={0}
                collapses={category.subcategories.map(
                  (subcategory, sindex) => ({
                    title: subcategory.label,
                    content: (
                      <List key={sindex}>
                        {subcategory.subsubcategories.map(
                          (subsubcategory, ssindex) => (
                            <ListItem
                              className={classes.subsubcategory}
                              key={ssindex}
                              button
                              disableRipple
                              selected={subsubcategoryId === ssindex}
                              onClick={() => handleClickSubsubcategory(ssindex)}
                              onMouseDown={(e) => e.stopPropagation()} // workaround : https://github.com/mui-org/material-ui/issues/5104#issuecomment-521976038
                            >
                              <Subsubcategory
                                subsubcategory={subsubcategory}
                                active={subsubcategoryId === ssindex}
                                level={level}
                                onClickLevel={setLevel}
                              />
                            </ListItem>
                          ),
                        )}
                      </List>
                    ),
                  }),
                )}
              />
            ),
          }))}
        />
      </CardBody>
    </Card>
  )
}

export default QuestionsList
