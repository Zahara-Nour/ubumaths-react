import React from 'react'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Button from 'components/CustomButtons/Button'

// @material-ui/icons
import FileCopyIcon from '@material-ui/icons/FileCopy'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import AddIcon from '@material-ui/icons/Add'

function EditButtons({ saving, onSave, onNew, onDuplicate }) {
  return (
    <GridContainer alignItems='center'>
      <GridItem xs={4}>
        <Button disabled={saving} justIcon round color='rose' onClick={()=>onSave()}>
          <SaveAltIcon />
        </Button>
      </GridItem>
      <GridItem xs={4}>
        <Button disabled={saving} justIcon round color='rose' onClick={onNew}>
          <AddIcon />
        </Button>
      </GridItem>
      <GridItem xs={4}>
        <Button
          disabled={saving}
          justIcon
          round
          color='rose'
          onClick={onDuplicate}
        >
          <FileCopyIcon />
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default EditButtons
