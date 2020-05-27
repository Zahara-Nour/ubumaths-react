import React, { useState, useCallback, useRef } from 'react'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import FlashCard from '../flash-cards/FlashCard'
import generateCard from '../flash-cards/generateCard'
import EditCard from '../flash-cards/EditCard'
import { AiOutlineSelect } from 'react-icons/ai'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'
import { useHistory } from 'react-router-dom'

import { createDocument, saveDocument } from 'features/db/db'

import styles from 'assets/jss/views/regularFormsStyle'
import { makeStyles } from '@material-ui/core'

import emptyCard from '../flash-cards/emptyCard'
import Filter from 'components/Filter'

import Badge from 'components/Badge/Badge'
import Portal from 'components/Portal'
import {
  SAVE_TYPES,
  saveDb,
  saveFailure,
  saveSuccess,
} from 'features/db/dbSlice'
import { useDispatch } from 'react-redux'
import NotifAlert from 'components/NotifAlert'

const useStyles = makeStyles(styles)

function Edit({ filters: defaultFilters }) {
  const classes = useStyles()
  const portalRef = useRef(null)

  // bug : portal does'n appear without a rerender
  const [, setPortalRendered] = useState(false)

  // useEffect(() => {
  //   if (savedTitle) {
  //     setCard(sortedCards.findIndex((card) => card.title === savedTitle))
  //   }
  // }, [savedTitle, sortedCards])

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
  

  // console.log('newCard', newCard)
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={4} lg={4}>
        <Card>
          <CardHeader color='rose' icon>
            <CardIcon color='rose'>
              <AiOutlineSelect />
            </CardIcon>
          </CardHeader>
          <CardBody>
            <Filter
              type='select'
              path='Subjects'
              label='Matière'
              filterName='subject'
              defaultFilters={defaultFilters}
            >
              <Filter
                type='select'
                path='Domains'
                label='Domaine'
                filterName='domain'
                filterNameAppended
              >
                <Filter
                  type='select'
                  path='Themes'
                  label='Thème'
                  filterName='theme'
                  filterNameAppended
                >
                  <Filter
                    type='list'
                    path='FlashCards'
                    label='FlashCards'
                    render={renderItemList}
                    sort={sortCards}
                    listen
                  >
                    <Portal
                      container={portalRef.current}
                      onRendered={() => {
                        setPortalRendered(true)
                      }}
                    >
                      <EditAndDisplay />
                    </Portal>
                  </Filter>
                </Filter>
              </Filter>
            </Filter>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={8} lg={8}>
        <div ref={portalRef} />
      </GridItem>
    </GridContainer>
  )
}

function EditAndDisplay({ element: card }) {
  const dispatch = useDispatch()
  const [newCard, setNewCard] = useState({ ...emptyCard })
  const [generatedCard, setGeneratedCard] = useState({ ...emptyCard })
  const [savedError, setSavedError] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const history = useHistory()

  const save = (path = 'FlashCards', document = newCard) => {
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
        setSavedSuccess(true)
        dispatch(saveSuccess({ data: document, type, key }))
        if (
          document.name !== card.name ||
          document.subject !== card.subject ||
          document.domain !== card.domain ||
          document.theme !== card.theme
        ) {
          let url = `/dashboard/flash-cards/edit/${document.subject}/${document.domain}/${document.theme}/${document.name}`
          url =url.replace(/%/g,'%25')
          console.log('url', url)
          if (decodeURI(encodeURI(url)) !== url ) console.log ('*** URI malformed', url)
          history.push(encodeURI(url))
        
          
        }
      })
      .catch((error) => {
        console.log('error', error.message)
        setIsSaving(false)
        setSavedError(true)
        dispatch(saveFailure({ type, key }))
      })
  }

  // const save3 = (c = newCard) => {
  //   setSaving(true)
  //   saveCard(c)
  //     .then(() => {
  //       setSaving(false)
  //       setSaveSuccess(true)
  //       if (
  //         c.name !== card.name ||
  //         c.subject !== card.subject ||
  //         c.domain !== card.domain ||
  //         c.theme !== card.theme
  //       ) {
  //         setSubject(c.subject)
  //         setDomain(c.domain)
  //         setTheme(c.theme)
  //         setSavedTitle(c.name)
  //       }
  //     })
  //     .catch((error) => {
  //       setSaving(false)
  //       setSaveError(error)
  //     })
  // }

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
      {savedError && (
        <NotifAlert
          open={savedError}
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
    </>
  )
}
export default Edit
