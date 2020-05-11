/*eslint-disable*/
import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar'
import { NavLink } from 'react-router-dom'
import cx from 'classnames'

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Hidden from '@material-ui/core/Hidden'

import Icon from '@material-ui/core/Icon'
import logo from 'assets/img/gidouille.svg'

// core components
import AdminNavbarLinks from 'components/Navbars/AdminNavbarLinks.js'

import sidebarStyle from 'assets/jss/components/sidebarStyle.js'

import avatar from 'assets/img/faces/avatar.jpg'
import { useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'
import GidouilleIcon from 'assets/Icons/GidouilleIcon'

function Sidebar(props) {
  const [openAvatar, setOpenAvatar] = useState(false)
  const [miniActive, setMiniActive] = useState(true)
  const user = useSelector(selectUser)

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return window.location.href.indexOf(routeName) > -1 ? 'active' : ''
  }

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { classes, color, rtlActive } = props
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null
      }

      const navLinkClasses =
        classes.itemLink +
        ' ' +
        cx({
          [' ' + classes[color]]: activeRoute(prop.path),
        })
      const itemText =
        classes.itemText +
        ' ' +
        cx({
          [classes.itemTextMini]: props.miniActive && miniActive,
          [classes.itemTextMiniRTL]:
            rtlActive && props.miniActive && miniActive,
          [classes.itemTextRTL]: rtlActive,
        })

      const itemIcon =
        classes.itemIcon +
        ' ' +
        cx({
          [classes.itemIconRTL]: rtlActive,
        })
      return (
        <ListItem
          key={key}
          className={cx({ [classes.item]: prop.icon !== undefined })}
        >
          <NavLink
            to={'/dashboard' + prop.path}
            className={cx({ [navLinkClasses]: prop.icon !== undefined })}
          >
            {prop.icon !== undefined ? (
              typeof prop.icon === 'string' ? (
                <Icon className={itemIcon}>{prop.icon}</Icon>
              ) : (
                <prop.icon className={itemIcon} />
              )
            ) : (
              <span>{rtlActive ? prop.rtlMini : prop.mini}</span>
            )}
            <ListItemText
              primary={rtlActive ? prop.rtlName : prop.name}
              disableTypography={true}
              className={cx({ [itemText]: prop.icon !== undefined })}
            />
          </NavLink>
        </ListItem>
      )
    })
  }

  const { classes, logoText, routes, bgColor, rtlActive } = props
  const itemText =
    classes.itemText +
    ' ' +
    cx({
      [classes.itemTextMini]: props.miniActive && miniActive,
      [classes.itemTextMiniRTL]: rtlActive && props.miniActive && miniActive,
      [classes.itemTextRTL]: rtlActive,
    })

  const userWrapperClass =
    classes.user +
    ' ' +
    cx({
      [classes.whiteAfter]: bgColor === 'white',
    })
  const caret =
    classes.caret +
    ' ' +
    cx({
      [classes.caretRTL]: rtlActive,
    })

  const photo =
    classes.photo +
    ' ' +
    cx({
      [classes.photoRTL]: rtlActive,
    })
  const userInfo = (
    <div className={userWrapperClass}>
      <div className={photo}>
        <img
          alt={user.name}
          src={user.imageUrl}
          className={classes.avatarImg}
        />
      </div>
      <List className={classes.list}>
        <ListItem className={classes.item + ' ' + classes.userItem}>
          <NavLink
            to={'#'}
            className={classes.itemLink + ' ' + classes.userCollapseButton}
            onClick={() => {}}
          >
            <ListItemText
              primary={
                rtlActive
                  ? 'تانيا أندرو'
                  : `${user.familyName} ${user.givenName}`
              }
              disableTypography={true}
              className={itemText + ' ' + classes.userItemText}
            />
          </NavLink>
        </ListItem>
      </List>
    </div>
  )
  var links = <List className={classes.list}>{createLinks(routes)}</List>

  const logoNormal =
    classes.logoNormal +
    ' ' +
    cx({
      [classes.logoNormalSidebarMini]: props.miniActive && miniActive,
      [classes.logoNormalSidebarMiniRTL]:
        rtlActive && props.miniActive && miniActive,
      [classes.logoNormalRTL]: rtlActive,
    })
  const logoMini =
    classes.logoMini +
    ' ' +
    cx({
      [classes.logoMiniRTL]: rtlActive,
    })
  const logoClasses =
    classes.logo +
    ' ' +
    cx({
      [classes.whiteAfter]: bgColor === 'white',
    })
  var brand = (
    <div className={logoClasses}>
      <div className={logoMini}>
      <GidouilleIcon color='#00acc1' size='2em' />
      </div>
      <div className={logoNormal}>{logoText}</div>
    </div>
  )
  const drawerPaper =
    classes.drawerPaper +
    ' ' +
    cx({
      [classes.drawerPaperMini]: props.miniActive && miniActive,
      [classes.drawerPaperRTL]: rtlActive,
    })
  const sidebarWrapper =
    classes.sidebarWrapper +
    ' ' +
    cx({
      [classes.drawerPaperMini]: props.miniActive && miniActive,
    })

  return (
    <div>
      <Hidden mdUp implementation='css'>
        <Drawer
          variant='temporary'
          anchor={rtlActive ? 'left' : 'right'}
          open={props.open}
          classes={{
            paper: drawerPaper + ' ' + classes[bgColor + 'Background'],
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={sidebarWrapper}>
            {userInfo}
            <AdminNavbarLinks rtlActive={rtlActive} />
            {links}
          </div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation='css'>
        <Drawer
          onMouseOver={() => setMiniActive(false)}
          onMouseOut={() => setMiniActive(true)}
          anchor={rtlActive ? 'right' : 'left'}
          variant='permanent'
          open
          classes={{
            paper: drawerPaper + ' ' + classes[bgColor + 'Background'],
          }}
        >
          {brand}
          <div className={sidebarWrapper}>
            {userInfo}
            {links}
          </div>
        </Drawer>
      </Hidden>
    </div>
  )
}

Sidebar.defaultProps = {
  bgColor: 'blue',
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(['white', 'black', 'blue']),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    'white',
    'red',
    'orange',
    'green',
    'blue',
    'purple',
    'rose',
  ]),
  logo: PropTypes.string,
  logoText: PropTypes.string,

  routes: PropTypes.arrayOf(PropTypes.object),
  miniActive: PropTypes.bool,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
}

export default withStyles(sidebarStyle)(Sidebar)
