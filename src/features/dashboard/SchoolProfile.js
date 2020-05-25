import React from 'react'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardIcon from 'components/Card/CardIcon'
import CardBody from 'components/Card/CardBody'
import ListAdd from './ListAdd'
import EditIcon from '@material-ui/icons/Edit'

function SchoolProfile({ id }) {
   
  const [country, city, name] = id.split('-')


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
        <ListAdd path={`Schools/${id}/Classrooms`} newLabel='Nouvelle classe'/>
      </CardBody>
    </Card>
  )
}

export default SchoolProfile
