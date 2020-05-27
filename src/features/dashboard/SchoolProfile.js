import React from 'react'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import EditIcon from '@material-ui/icons/Edit'
import Filter from 'components/Filter'

function SchoolProfile({ id }) {
   
  const [country, city, name] = id.split('_')
  console.log('schoolid', id)


  return (
    <Card>
      <CardHeader color='rose' icon>
        <CardIcon color='rose'>
          <EditIcon />
        </CardIcon>
      </CardHeader>
      <CardBody>
        <h3>{name}</h3>
        <h4>{country} - {city}</h4>
        <Filter type='list' path={`Schools/${id}/Classrooms`} newLabel='Nouvelle classe' add/>
      </CardBody>
    </Card>
  )
}

export default SchoolProfile
