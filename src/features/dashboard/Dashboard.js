import React from 'react'
import cx from 'classnames'
import { Switch, Route } from 'react-router-dom'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components
import AdminNavbar from 'components/AdminNavbar.js'
import Footer from 'components/Footer/Footer.js'
import Sidebar from 'components/Sidebar/Sidebar.js'

import routes from 'routes.js'

import styles from 'assets/jss/layouts/adminStyle.js'

const useStyles = makeStyles(styles)

export default function Dashboard(props) {
  const { ...rest } = props
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [miniActive, setMiniActive] = React.useState(false)

  const logo = require('assets/img/logo-white.svg')
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
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    window.addEventListener('resize', resizeFunction)

    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener('resize', resizeFunction)
    }
  })

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const getActiveRoute = (routes) => {
    let activeRoute = 'DashBoard'
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name
      }
    }
    return activeRoute
  }
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route
          path={prop.layout + prop.path}
          component={prop.component}
          key={key}
        />
      )
    })
  }
  const sidebarMinimize = () => {
    setMiniActive(!miniActive)
  }
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false)
    }
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={'Creative Tim'}
        logo={logo}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={'blue'}
        bgColor={'black'}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />

        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>{getRoutes(routes)}</Switch>
          </div>
        </div>

        <Footer fluid />
      </div>
    </div>
  )
}
