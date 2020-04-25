import Charts from 'views/Charts/Charts.js'

import Widgets from 'views/Widgets/Widgets.js'
import Users from 'features/dashboard/Users'

// @material-ui/icons

import DateRange from '@material-ui/icons/DateRange'
import Timeline from '@material-ui/icons/Timeline'
import WidgetsIcon from '@material-ui/icons/Widgets'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'

var dashRoutes = [
  {
    path: '/widgets',
    name: 'Widgets',
    rtlName: 'الحاجيات',
    icon: WidgetsIcon,
    component: Widgets,
    layout: '/dashboard',
  },
  {
    path: '/charts',
    name: 'Charts',
    rtlName: 'الرسوم البيانية',
    icon: Timeline,
    component: Charts,
    layout: '/dashboard',
  },
  {
    path: '/users',
    name: 'Gestion des utilisateurs',
    rtlName: 'التقويم',
    icon: PeopleAltRoundedIcon,
    component: Users,
    layout: '/dashboard',
  },
]
export default dashRoutes
