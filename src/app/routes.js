import Charts from 'views/Charts/Charts.js'

import Widgets from 'views/Widgets/Widgets.js'
import Users from 'features/dashboard/Users'

// @material-ui/icons

import DateRange from '@material-ui/icons/DateRange'
import Timeline from '@material-ui/icons/Timeline'
import WidgetsIcon from '@material-ui/icons/Widgets'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import FlashCardsManager from 'features/dashboard/FlashCardsManager'
import { BsCardText } from 'react-icons/bs'

var dashRoutes = [
  {
    path: '/users',
    name: 'Gestion des utilisateurs',
    icon: PeopleAltRoundedIcon,
    component: Users,
  },
  {
    path: '/flash-cards',
    name: 'Flash cards',
    icon: BsCardText,
    component: FlashCardsManager,
  },
]
export default dashRoutes
