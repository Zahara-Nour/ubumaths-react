import React from 'react'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Button from 'components/CustomButtons/Button'
import TextInput from '../../components/TextInput'

import DeleteIcon from '@material-ui/icons/Delete'

function EditVariables({ variables, onAdd, onChange, onDelete }) {

  if (!variables) return null
  return (
    <>
      <GridContainer alignItems='center'>
        <GridItem xs={6}>
          <h4>variables</h4>
        </GridItem>
        <GridItem xs={6}>
          <Button size='sm' color='success' onClick={onAdd}>
            +
          </Button>
        </GridItem>
      </GridContainer>

      <hr />
      {Object.getOwnPropertyNames(variables).map((name) => (
        <GridContainer key={name} alignItems='center'>
          <GridItem xs={3}>{name}</GridItem>
          <GridItem xs={6}>
            <TextInput
              label={name}
              defaultText={variables[name]}
              onChange={(value) => onChange(name)(value)}
              throttle={500}
            />
          </GridItem>
          <GridItem xs={3}>
            <Button justIcon onClick={onDelete(name)}>
              <DeleteIcon />
            </Button>
          </GridItem>
        </GridContainer>
      ))}
    </>
  )
}

export default EditVariables
