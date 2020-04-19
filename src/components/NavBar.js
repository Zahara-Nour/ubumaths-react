import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faInfinity } from '@fortawesome/free-solid-svg-icons'
import AuthButton from '../features/auth/AuthButton'
import { useSelector } from 'react-redux'
import { selectConnected, selectUser } from 'features/auth/authSlice'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard'
import Menu from '@material-ui/icons/Menu'
import Fingerprint from '@material-ui/icons/Fingerprint'

// core components
import Button from 'components/CustomButtons/Button'

import styles from 'assets/jss/components/authNavbarStyle.js'

const useStyles = makeStyles(styles)

function NavBar(props) {
  const connected = useSelector(selectConnected)
  const user = useSelector(selectUser)
  const [open, setOpen] = useState(false)
  const handleDrawerToggle = () => setOpen(!open)

  const classes = useStyles()

  const listLeft = (
    <List>
      <ListItem className={classes.listItem}>
        <NavLink to={'/games'} className={classes.navLink}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText
            primary={'Jeux'}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>

      <ListItem className={classes.listItem}>
        <NavLink to={'/calcul-mental'} className={classes.navLink}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText
            primary={'Calcul mental'}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>
    </List>
  )

  const listRight = (
    <List>
      <ListItem className={classes.listItem}>
        <NavLink to={'/admin/dashboard'} className={classes.navLink}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText
            primary={'Dashboard'}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>
      {connected && (
        <ListItem className={classes.listItem}>
          <img alt='profile' src={user.imageUrl} />
        </ListItem>
      )}
      {connected && (
        <ListItem className={classes.listItem}>
          <strong>{user.name}</strong>
        </ListItem>
      )}
    </List>
  )

  return (
    <AppBar position='static' className={classes.appBar}>
      <Toolbar className={classes.container}>
        <NavLink to={'/'} className={classes.navLink}>
          <FontAwesomeIcon icon={faInfinity} />
        </NavLink>
        <Hidden smDown>{listLeft}</Hidden>
        <div className={classes.flex}></div>
        <Hidden smDown>{listRight}</Hidden>
        <Hidden mdUp>
          <Button
            className={classes.sidebarButton}
            color='transparent'
            justIcon
            aria-label='open drawer'
            onClick={handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
        <Hidden mdUp>
          <Drawer
            variant='temporary'
            anchor={'right'}
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {listLeft}
            {listRight}
          </Drawer>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar

NavBar.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
}
