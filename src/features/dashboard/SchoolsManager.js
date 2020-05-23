import React from 'react'

import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import SchoolIcon from '@material-ui/icons/School'
import { Container } from '@material-ui/core'
import SelectAddElement from './SelectAddElement'

function SchoolsManager() {
  return (
    <Container fixed>
      <GridContainer alignItems='center'>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <Card>
            <CardHeader color='rose' icon>
              <CardIcon color='rose'>
                <SchoolIcon />
              </CardIcon>
            </CardHeader>
            <CardBody>
              <h2>Flash Cards</h2>
              <SelectAddElement
                path='Countries'
                label='Pays'
                newLabel='Nouveau Pays'
                filterName='country'
              >
                <SelectAddElement
                  path='Cities'
                  label='Ville'
                  newLabel='Nouvelle Ville'
                  filterName='city'
                >
                  <SelectAddElement
                    path='Schools'
                    label='Ecole'
                    newLabel='Nouvelle école'
                    filterName='school'
                  />
                </SelectAddElement>
              </SelectAddElement>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </Container>
  )
}

export default SchoolsManager
