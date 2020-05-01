import React, { useState } from 'react'
import { CircularProgress, List, ListItem } from '@material-ui/core'
import Button from 'components/CustomButtons/Button'
import { useAssessments } from 'app/hooks'
import { grayColor } from 'assets/jss/main-jss'
import { useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'
const listItemAssessmentStyle = {
  marginLeft: '10px',
  marginRight: '10px',
}

function AssessmentsList({ type, onSelect, onLoad, selected, saved }) {
  const lists = {}
  const user = useSelector(selectUser)
  lists['Modèle global'] = useAssessments({ type: 'Modèle global', saved })[0]
  lists['Modèle'] = useAssessments({ type: 'Modèle', saved })[0]
  lists['Evaluation'] = useAssessments({ type: 'Evaluation', saved })[0]
  const [clicked, setClicked] = useState(true)

  if (user.role==='student') console.log(`lists[${type}]`, lists[type])

  if (!lists[type]) return <CircularProgress />

  if (onLoad && lists[type]) {
    onLoad(lists[type].map(({ title }) => title))
  }

  return lists[type] ? (
    <List>
      {lists[type].map(({ title }, index) => (
        <ListItem
          selected={title === selected}
          key={index}
          button
          disableRipple
          onClick={() => {
            if (onSelect) {
              onSelect(title)
            }
          }}
        >
          <h4 style={listItemAssessmentStyle}>{title}</h4>
          {user.role === 'student' && (
            <div>
              <Button
                style={{
                  ...listItemAssessmentStyle,
                  backgroundColor: grayColor[3],
                }}
                size='sm'
                disable={clicked}
                onClick={(e) => {
                  onSelect(e, lists[type][index].title, false)
                setClicked(true)}}
              >
                S'entraîner
              </Button>

              <Button
                style={listItemAssessmentStyle}
                size='sm'
                color='danger'
                disable={clicked}
                onClick={(e) => {
                  setClicked(true)
                  onSelect(e, lists[type][index].title, true)}}
              >
                Faire
              </Button>
            </div>
          )}
        </ListItem>
      ))}
    </List>
  ) : null
}

export default AssessmentsList
