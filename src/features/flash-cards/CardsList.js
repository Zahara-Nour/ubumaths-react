import React, { useEffect, useState } from 'react'

import { List, ListItem } from '@material-ui/core'
import { useCards } from 'app/hooks'

// ne carte est définie par sa matière, son domaine, son theme et son niveau.
function CardsList({ subject, domain, theme, level, onSelect, onCards }) {
  const [cards, isLoadingCards, isErrorCards] = useCards(
    subject,
    domain,
    theme,
    level,
  )

  const [selected, setSelected] = useState(0)

  useEffect(() => onCards(cards), [cards, onCards])

  return cards.length > 0 ? (
    <List>
      {cards.map((card, index) => (
        <ListItem
          selected={index === selected}
          button
          disableRipple
          key={card.id}
          onClick={() => {
            setSelected(index)
            onSelect(index)
          }}
        >
          <h4> {card.title}</h4>
        </ListItem>
      ))}
    </List>
  ) : null
}

export default CardsList
