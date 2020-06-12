import React, { useState, useCallback, useRef } from 'react'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import FlashCard from '../../flash-cards/FlashCard'
import generateCard from '../../flash-cards/generateCard'
import EditCard from './EditCard'
import { AiOutlineSelect } from 'react-icons/ai'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import { useHistory } from 'react-router-dom'

import { createDocument, saveDocument } from 'features/db/db'

import styles from 'assets/jss/views/regularFormsStyle'
import { makeStyles } from '@material-ui/core'

import emptyCard from '../../flash-cards/emptyCard'
import Filter from 'components/Filter'

import Badge from 'components/Badge/Badge'
import Portal from 'components/Portal'
import {
  SAVE_TYPES,
  saveDb,
  saveFailure,
  saveSuccess,
} from 'features/db/dbSlice'
import { useDispatch, useSelector } from 'react-redux'
import NotifAlert from 'components/NotifAlert'
import { selectRoles, selectIsAdmin } from 'features/auth/authSlice'
import { getLogger } from 'app/utils'



const useStyles = makeStyles(styles)

function EditCards({ filters: defaultFilters, match }) {
  const classes = useStyles()
  const portalRef = useRef(null)
  const roles = useSelector(selectRoles)
  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // bug : portal does'n appear without a rerender
  const [, setPortalRendered] = useState(false)

  const sortCards = useCallback((a, b) => {
    if (a.level < b.level) return -1
    if (a.level > b.level) return 1
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  }, [])

  const renderItemList = useCallback(
    (card) => (
      <GridContainer alignItems='center'>
        <GridItem xs={2}>
          <Badge color='rose'>{card.level}</Badge>
        </GridItem>
        <GridItem xs={4}>
          <Badge color='rose'>{card.grade}</Badge>
        </GridItem>
        <GridItem xs={6}>
          <h4>{card.name}</h4>
        </GridItem>
      </GridContainer>
    ),
    [],
  )

  const portal = (
    <Portal
      container={portalRef.current}
      onRendered={() => {
        setPortalRendered(true)
      }}
    >
      <EditAndDisplay  onSaveError={setSavedError} onSaveSucccess={setSavedSuccess}/>
    </Portal>
  )

  let filters
  if (roles.includes('admin')) {
    filters = (
      <Filter
        type='select'
        path='Subjects'
        label='Matière'
        filterName='subject'
        defaultFilters={defaultFilters}
        add
      >
        <Filter
          type='select'
          path='Domains'
          label='Domaine'
          filterName='domain'
          filterNameAppended
          add
        >
          <Filter
            type='select'
            path='Themes'
            label='Thème'
            filterName='theme'
            filterNameAppended
            add
          >
            <Filter
              type='list'
              path='FlashCards'
              label='FlashCards'
              render={renderItemList}
              sort={sortCards}
              listen
            >
              {portal}
            </Filter>
          </Filter>
        </Filter>
      </Filter>
    )
  } else
    filters = (
      <Filter
        type='select'
        path='Subjects'
        label='Matière'
        filterName='subject'
        defaultFilters={defaultFilters}
      >
        <Filter
          type='select'
          path='Themes'
          label='Thème'
          filterName='theme'
          listen
          user
          add
        >
          <Filter
            type='list'
            path='FlashCards'
            label='FlashCards'
            sort={sortCards}
            listen
            user
          >
            {portal}
          </Filter>
        </Filter>
      </Filter>
    )

  // console.log('newCard', newCard)
  return (
    <div>
    <GridContainer>
      <GridItem xs={12} sm={12} md={4} lg={4}>
        <Card>
          <CardHeader color='rose' icon>
            <CardIcon color='rose'>
              <AiOutlineSelect />
            </CardIcon>
          </CardHeader>
          <CardBody>{filters}</CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={8} lg={8}>
        <div ref={portalRef} />
      </GridItem>
    </GridContainer>
    {savedError && (
      <NotifAlert
        open={!!savedError}
        message={"L'enregistement' a échoué ! " + savedError}
        color='danger'
        onClose={() => setSavedError(false)}
      />
    )}
    {savedSuccess && (
      <NotifAlert
        open={savedSuccess}
        message={"L'enregistement' a réussi ! "}
        color='success'
        autoclose
        onClose={() => setSavedSuccess(false)}
      />
    )}
    </div>
  )
}

function EditAndDisplay({ element: card, onSaveError, onSaveSucccess }) {
  const {error, warn} = getLogger('EditAndDisplay')
  const dispatch = useDispatch()
  const isAdmin = useSelector(selectIsAdmin)
  const [newCard, setNewCard] = useState({ ...emptyCard })
  const [generatedCard, setGeneratedCard] = useState({ ...emptyCard })
  
  const [isSaving, setIsSaving] = useState(false)
  const history = useHistory()
  

  const save = (path='FlashCards', document = newCard) => {
    setIsSaving(true)
    const pathArray = path.split('/')
    const collection = pathArray[pathArray.length - 1]
    const type = SAVE_TYPES['SAVE_' + collection.toUpperCase()]
    const key = dispatch(saveDb({ type }))

    const promise = document.id
      ? saveDocument({ path, document })
      : createDocument({ path, document })

    return promise
      .then(() => {
        setIsSaving(false)
        onSaveSucccess(true)
        dispatch(saveSuccess({ data: document, type, key }))
        if (
          document.name !== card.name ||
          document.subject !== card.subject ||
          (isAdmin && document.domain !== card.domain) ||
          document.theme !== card.theme
        ) {
          let url = isAdmin ?
          `/dashboard/flash-cards/edit/${document.subject}/${document.domain}/${document.theme}/${document.name}`
          :`/dashboard/flash-cards/edit/${document.subject}/${document.theme}/${document.name}`

          url = url.replace(/%/g, '%25')
       
          if (decodeURI(encodeURI(url)) !== url) warn('URI malformed', url)
          history.push(encodeURI(url))
        }
      })
      .catch((err) => {
        error('error while saving card', err.message)
        setIsSaving(false)
        onSaveError(err.message)
        dispatch(saveFailure({ type, key }))
      })
  }

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <EditCard
            card={card}
            onNewCard={setNewCard}
            onGeneratedCard={setGeneratedCard}
            onSave={save}
            saving={isSaving}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <FlashCard card={generateCard(generatedCard)} />
        </GridItem>
      </GridContainer>
      
    </>
  )
}
export default EditCards
