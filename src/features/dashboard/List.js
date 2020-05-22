import React, { useEffect } from 'react'
import { List as MuiList, ListItem } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'

function List({ elements, selected, onSelect, children = [] }) {
  if (!Array.isArray(children)) children = [children]

  useEffect(() => {
    if (onSelect && elements && elements.length > 0) onSelect(0)
  }, [elements, onSelect])

  if (!elements || elements.length === 0) return null
  return (
    <MuiList>
      {elements.map((element, i) => {
        const name = elements[i].name
        let item
        switch (children.length) {
          case 1:
            item = (
              <GridContainer>
                <GridItem xs={9}>
                  <h4> {name}</h4>
                </GridItem>
                <GridItem xs={3}>{children[0]}</GridItem>
              </GridContainer>
            )

            break

          case 2:
            item = (
              <GridContainer>
                <GridItem xs={2}>{children[0]}</GridItem>
                <GridItem xs={8}>
                  <h4> {name}</h4>
                </GridItem>
                <GridItem xs={2}>{children[1]}</GridItem>
              </GridContainer>
            )
            break

          default:
            item = <h4> {name}</h4>
        }

        return (
          <ListItem
            onClick={() => onSelect && onSelect(i)}
            selected={onSelect && selected === i}
            button
            disableRipple
            key={name}
          >
            {item}
          </ListItem>
        )
      })}
    </MuiList>
  )
}

export default List
