import React, { useState } from 'react'
import { List as MuiList, ListItem, makeStyles } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'


function List({ elements, selected, onSelect, children = [], render, defaultName, label }) {
  if (!Array.isArray(children)) children = [children] 
 const [scrolled, setScrolled] = useState(false)

  const styles = onSelect
    ? {}
    : {
        listItem: {
          '&.MuiListItem-button:hover': {
            background: 'none',
            cursor: 'auto',
          },
          '&.MuiButtonBase-root:hover': {
            cursor: 'auto',
          },
        },
      }

  const useStyles = makeStyles(styles)
  const classes = useStyles()

  

 
  
  if (!scrolled && defaultName)  {

    const  element = document.getElementById(defaultName)
   
    if (element)  {
      element.scrollIntoView()
      setScrolled(true)
    }
  }



  if (!elements || elements.length === 0) return null

  return (
    <MuiList style={{ maxHeight: 300, overflow: 'auto' }}>
      {elements.map((element, i) => {
        const name = element.name

        let item
        if (!render) {
          switch (children.length) {
            case 1:
              item = (
                <GridContainer>
                  <GridItem xs={6}>
                    <h4>{name}</h4>
                  </GridItem>
                  <GridItem xs={6}>
                    {children[0].props.render
                      ? children[0].props.render(element)
                      : children[0]}
                  </GridItem>
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
        }

        return (
          <ListItem
            className={classes.listItem}
            onClick={() => onSelect && onSelect(name)}
            selected={onSelect && selected && selected === name}
            button
            disableRipple
            id={name}
            key={i}
          >
            {render ? render(element) : item}
          </ListItem>
        )
      })}
    </MuiList>
  )
}

export default List
