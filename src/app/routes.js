// @material-ui/icons
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import FlashCardsManager from 'features/dashboard/FlashCardsManager'
import DatabaseManager from 'features/dashboard/DatabaseManager'
import StorageIcon from '@material-ui/icons/Storage'
import { BsCardText } from 'react-icons/bs'
import SchoolIcon from '@material-ui/icons/School'
import SchoolsManager from 'features/dashboard/SchoolsManager'
import UsersManager from 'features/dashboard/UsersManager'

const users = {
  path: '/users',
  name: 'Gestion des utilisateurs',
  icon: PeopleAltRoundedIcon,
  component: UsersManager,
}
const flashcards = {
  path: '/flash-cards',
  name: 'Flash cards',
  icon: BsCardText,
  component: FlashCardsManager,
}

const database = {
  path: '/database',
  name: 'Database',
  icon: StorageIcon,
  component: DatabaseManager,
}

const schools = {
  path: '/schools',
  name: 'Etablissements',
  icon: SchoolIcon,
  component: SchoolsManager,
}

const dashboardRoutes = (role) => {
  switch (role) {
    case 'admin':
      return [schools, database, flashcards, users]

    case 'student':
      return [flashcards]

    case 'teacher':
      return [users, flashcards]

    case 'referent':
      return [users, schools]

    case 'parent':
      return []

    case 'contibutor':
      return [flashcards]

    default:
      return []
  }
}
export default dashboardRoutes
