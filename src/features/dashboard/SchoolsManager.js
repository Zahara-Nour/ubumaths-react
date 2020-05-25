import React, { useRef, useEffect, useState } from 'react'

import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import SchoolIcon from '@material-ui/icons/School'
import { Container } from '@material-ui/core'
import SelectAddElement from './SelectAddElement'
import Portal from './Portal'
import SchoolProfile from './SchoolProfile'
import { useSelector } from 'react-redux'
import {
  selectIsAdmin,
  selectIsReferent,
  selectUser,
  selectRoles,
} from 'features/auth/authSlice'

function SchoolsManager() {
  const portalRef = useRef(null)

  // bug : portal does'n appear without a rerender
  const [portalRendered, setPortalRendered] = useState(false)

  const isAdmin = useSelector(selectIsAdmin)
  const isReferent = useSelector(selectIsReferent)
  const user = useSelector(selectUser)

  return (
    <Container fixed>
      {isReferent && (
        <GridContainer alignItems='flex-start'>
          <GridItem xs={12} sm={12} md={6} lg={6}>
            <SchoolProfile id={user.school} />
          </GridItem>
        </GridContainer>
      )}
      {isAdmin && (
        <GridContainer alignItems='flex-start'>
          <GridItem xs={12} sm={12} md={6} lg={6}>
            <Card>
              <CardHeader color='rose' icon>
                <CardIcon color='rose'>
                  <SchoolIcon />
                </CardIcon>
              </CardHeader>
              <CardBody>
                <h3>Etablissements scolaires</h3>

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
                    >
                      <Portal
                        container={portalRef.current}
                        onRendered={() => {
                          setPortalRendered(true)
                        }}
                      >
                        <SchoolProfile />
                      </Portal>
                    </SelectAddElement>
                  </SelectAddElement>
                </SelectAddElement>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6}>
            <div ref={portalRef} />
          </GridItem>
        </GridContainer>
      )}
    </Container>
  )
}

export default SchoolsManager
