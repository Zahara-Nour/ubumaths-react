import React from 'react'
import cx from 'classnames'
import { Switch, Route } from 'react-router-dom'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components
import AdminNavbar from 'components/AdminNavbar.js'
import Footer from 'components/Footer.js'
import Sidebar from 'components/Sidebar/Sidebar.js'

import getRoleRoutes from 'app/routes.js'

import styles from 'assets/jss/layouts/adminStyle.js'
import Error404 from 'components/Error404'
import { useSelector } from 'react-redux'
import { selectRoles } from 'features/auth/authSlice'

const useStyles = makeStyles(styles)

export default function Dashboard(props) {
  const { ...rest } = props
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [miniActive, setMiniActive] = React.useState(false)

  // styles
  const classes = useStyles()
  const mainPanelClasses =
    classes.mainPanel +
    ' ' +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf('Win') > -1,
    })
  // ref for main panel div
  const mainPanel = React.createRef()

  const getActiveRoute = (routes) => {
    let activeRoute = 'DashBoard'
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(props.match.path + routes[i].path) !== -1
      ) {
        return routes[i].name
      }
    }
    return activeRoute
  }

  const roles = useSelector(selectRoles)

  const routes = []
  roles.forEach((role) => {
    getRoleRoutes(role).forEach((route) => {
      if (!routes.includes(route)) routes.push(route)
    })
  })

  const getRoutes = (routes) => {
    return routes.map((prop, key) => (
      <Route
        path={props.match.path + prop.path}
        component={prop.component}
        key={key}
      />
    ))
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const sidebarMinimize = () => {
    setMiniActive(!miniActive)
  }
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false)
    }
  }

  React.useEffect(() => {
    window.addEventListener('resize', resizeFunction)

    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener('resize', resizeFunction)
    }
  })

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={'Ubu Maths'}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={'blue'}
        bgColor={'black'}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />

        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              <Route
                exact
                path={`${props.match.url}`}
                render={() => <Home />}
              />
              {getRoutes(routes)}
              <Route render={() => <Error404 />} />
            </Switch>
          </div>
        </div>

        <Footer fluid />
      </div>
    </div>
  )
}

function Home() {
  return <h2>dashboard</h2>
}
