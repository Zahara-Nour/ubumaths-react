import React, { useState, useCallback } from 'react'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import SelectScope from './SelectScope'
import CardsList from './CardsList'
import FlashCard from './FlashCard'
import generateCard from './generateCard'
import EditCardFields from './EditCardFields'
import { AiOutlineSelect } from 'react-icons/ai'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'



import styles from 'assets/jss/views/regularFormsStyle'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(styles)

function EditFlashCard() {
  const classes = useStyles()
  const emptyCard = {
    enounce: '',
    variables: {},
    answer: '',
    explanation: '',
    warning: '',
    theme: '',
    subject: '',
  }

  const [subject, setSubject] = useState('')

  const [domain, setDomain] = useState('')

  const [theme, setTheme] = useState('')
  const [cards, setCards] = useState([])
  const [iCard, setIcard] = useState(0)
  const [newCard, setNewCard] =useState(emptyCard)

  const handleScope = useCallback( ({ subject, domain, theme }) => {
    setSubject(subject)
    setDomain(domain)
    setTheme(theme)
  }, [])
  
  // console.log('newCard', newCard)
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={3} lg={3}>
        <Card>
          <CardHeader color='rose' icon>
            <CardIcon color='rose'>
              <AiOutlineSelect />
            </CardIcon>
            
          </CardHeader>
          <CardBody>
            <SelectScope needThemes onChange={handleScope} />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={3} lg={3}>
        {theme && (
          <Card>
            <CardHeader color='rose' icon>
              <CardIcon color='rose'>
                <AiOutlineSelect />
              </CardIcon>
              
            </CardHeader>
            <CardBody>
              <CardsList
                subject={subject}
                domain={domain}
                theme={theme}
                onSelect={setIcard}
                onCards={setCards}
              />
            </CardBody>
          </Card>
        )}
      </GridItem>
      <GridItem xs={12} sm={12} md={3} lg={3}>
        {cards.length >0 && <EditCardFields card={cards[iCard]} onNewCard={setNewCard} />}
      </GridItem>
      <GridItem xs={12} sm={12} md={3} lg={3}>
        {cards.length >0  && <FlashCard card={generateCard(newCard)} />}
      </GridItem>
    </GridContainer>
  )
}

export default EditFlashCard
