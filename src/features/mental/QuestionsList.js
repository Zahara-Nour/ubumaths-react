import React from 'react'

import questions from './questions.json'
import NavPills from 'components/NavPills/NavPills.js'
import Accordion from 'components/Accordion/Accordion'

//import Subcategory from './Subcategory'
import SettingsIcon from '@material-ui/icons/Settings'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'

import Subsubcategories from './Subsubcategories'

function QuestionsList() {
  return (
    <Card>
      <CardHeader color='success' icon>
        <CardIcon color='success'>
          <SettingsIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        <NavPills
          color='warning'
          tabs={questions.map((category, index) => ({
            tabButton: category.label,
            tabContent: (
              <Accordion
                key={index}
                active={0}
                collapses={category.subcategories.map(
                  (subcategory, sindex) => ({
                    title: subcategory.label,
                    content: (
                      <Subsubcategories
                        key={sindex}
                        category={category.label}
                        subcategory={subcategory.label}
                        subsubcategories={subcategory.subsubcategories}
                      />
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
