import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import cx from 'classnames'
import './NavBar.css'

import AuthButton from '../features/auth/AuthButton'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectUser } from 'features/auth/authSlice'

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
import { BsCardText } from 'react-icons/bs'
import { AiOutlineCalculator } from 'react-icons/ai'

// core components
import Button from 'components/CustomButtons/Button'

import styles from 'assets/jss/components/navbarStyle.js'
import { ListItemAvatar, Avatar } from '@material-ui/core'
import GidouilleIcon from 'assets/Icons/GidouilleIcon'
import { selectIsLoading } from 'features/db/dbSlice'

const useStyles = makeStyles(styles)

const flexContainerColumn = {
  display: 'flex',
  flexDirection: 'column',
}

const flexContainerRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}
function NavBar(props) {
  const IsLoading = useSelector(selectIsLoading)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user = useSelector(selectUser)
  const [open, setOpen] = useState(false)
  const handleDrawerToggle = () => setOpen(!open)

  const classes = useStyles()

  const listLeft = (
    <>
     { isLoggedIn && <ListItem className={classes.listItem}>
        <NavLink to={'/dashboard'} className={classes.navLink}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText
            primary={'Dashboard'}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>}
      <ListItem className={classes.listItem}>
        <NavLink to={'/calcul-mental'} className={classes.navLink}>
          <AiOutlineCalculator className={classes.listItemIcon} />
          <ListItemText
            primary={'Calcul mental'}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/flash-cards'} className={classes.navLink}>
          <BsCardText className={classes.listItemIcon} />
          <ListItemText
            primary={'Flash Cards'}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>
    </>
  )

  const listRight = (
    <>
      {/* <ListItem className={classes.listItem}>
        <NavLink to={'/dashboard'} className={classes.navLink}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText
            primary={'Dashboard'}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem> */}
      {isLoggedIn && (
        <ListItem className={classes.listItem}>
          <ListItemAvatar>
            <Avatar alt={user.name} src={user.imageUrl} />
          </ListItemAvatar>
        </ListItem>
      )}
      {isLoggedIn && (
        <ListItem className={classes.listItem}>
          <ListItemText
            primary={user.name}
            className={classes.listItemText}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
        </ListItem>
      )}

      <ListItem className={classes.listItem}>
        <AuthButton />
      </ListItem>
    </>
  )

  return (
    <AppBar position='static' className={classes.appBar}>
      <Toolbar disableGutters className={classes.container}>
        <NavLink to={'/'} className={classes.navLink}>
          {/* <FontAwesomeIcon icon={faInfinity} /> */}
          {/* <Gidouille/> */}
          <GidouilleIcon className={cx({ 'logo-spin': IsLoading })} />
        </NavLink>

        <Hidden smDown>
          <List className={classes.list}>{listLeft}</List>
        </Hidden>
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
            <List style={flexContainerColumn}>{listLeft}</List>
            <List style={{ ...flexContainerColumn, alignItems: 'center' }}>
              {listRight}
            </List>
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
