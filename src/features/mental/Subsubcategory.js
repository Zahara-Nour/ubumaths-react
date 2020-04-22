import React, { useState, memo } from 'react'

import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addToBasket, launchAssessment, setBasket } from '../mental/mentalSlice'
import Description from './Description'
import NumberSelect from 'components/NumberSelect'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from 'components/CustomButtons/Button'
import { makeStyles } from '@material-ui/core'
import LevelButtons from './LevelButtons'



const listStyle = (theme) => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
    },
  },
  listItem: {
    root: {
      background:'black',
      backgroundColor:'black',
      '&$selected, &$selected:hover': {
        backgroundColor: 'warning',
      },
    },
  },
})

const flexContainerColumn = {
  display: 'flex',
  flexDirection: 'column',
}

const flexContainerRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}

const useStyles = makeStyles(listStyle)

function Subsubcategory({ active, subsubcategory, onClickLevel, name, level }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [nbQuestions, setNbQuestions] = useState(1)
  const levels = subsubcategory.levels

  const classes = useStyles()

  const [question, setQuestion] = useState({
    ...levels[level],
  })

  const [delay, setDelay] = useState(question.defaultDelay)


  const handleClickBasket = () => {
    const questions = []
    for (let i = 0; i < nbQuestions; i++) {
      questions.push({
        ...question,
        delay: parseInt(delay, 10) * 1000,
      })
    }
    dispatch(addToBasket({ questions }))
  }

  const handleClickGo = () => {
    const questions = []
    for (let i = 0; i < 5; i++) {
      questions.push({
        ...question,
        delay: parseInt(delay, 10) * 1000,
      })
    }
    dispatch(setBasket({ questions: [] }))
    dispatch(addToBasket({ questions }))
    dispatch(launchAssessment({ marked: false }))
  }

  return (
    <List className={classes.flexContainer}>
      {!active && <ListItem>{subsubcategory.label}</ListItem>}
      {active && (
        <ListItem  style={flexContainerColumn}>
          <Description question={question} label={subsubcategory.label} >

          {levels.length > 0 &&   <LevelButtons levels={levels} level={level} onChange={onClickLevel}/>}
          </Description>
            
          
        </ListItem>
      )}

      {active && (
        <ListItem style={flexContainerColumn}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <NumberSelect name='Délais' value={delay} onClick={setDelay} />
            {user.role === 'teacher' && (
              <NumberSelect
                name='Quantité'
                value={nbQuestions}
                onClick={setNbQuestions}
              />
            )}
          </div>
        </ListItem>
      )}

      {active && (
        <ListItem style={flexContainerColumn}>
          {user.role === 'teacher' && (
            <Button color='warning' size='sm' onClick={handleClickBasket}>
              <FontAwesomeIcon icon={faCartArrowDown} />
            </Button>
          )}

          <Button color='danger' size='sm' onClick={handleClickGo}>
            Go !
          </Button>
        </ListItem>
      )}
    </List>
  )
}

export default Subsubcategory
