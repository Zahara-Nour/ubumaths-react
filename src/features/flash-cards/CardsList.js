import React, { useEffect } from 'react'

import { List, ListItem } from '@material-ui/core'
import Button from 'components/CustomButtons/Button'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'

function CardsList({ cards, cardIndex, onSelect }) {
  
  useEffect(() => {
    if (cards && cards.length > 0) onSelect(0)
  }, [cards, onSelect])

  if (!cards || cards.length === 0) return null

  return (
    <List>
      {cards.map((card, index) => (
        <ListItem
          onClick={() => onSelect(index)}
          selected={index === cardIndex}
          button
          disableRipple
          key={card.id}
        >
          <GridContainer alignItems='center'>
            <GridItem xs={2}>
              <Button color='rose' round size='sm'>
                {card.level}
              </Button>
            </GridItem>
            <GridItem xs={3}>
              <Button color='rose' round size='sm'>
                {card.grade}
              </Button>
            </GridItem>
            <GridItem xs={7}>
              <h4> {card.title}</h4>
            </GridItem>
          </GridContainer>
        </ListItem>
      ))}
    </List>
  )
}

export default CardsList
