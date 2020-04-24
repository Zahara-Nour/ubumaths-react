/*eslint-disable*/
import React from 'react'
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

// core components
import AdminNavbarLinks from 'components/Navbars/AdminNavbarLinks.js'

import sidebarStyle from 'assets/jss/components/sidebarStyle.js'

import avatar from 'assets/img/faces/avatar.jpg'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openAvatar: false,
      miniActive: true,
    }
  }

  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return window.location.href.indexOf(routeName) > -1 ? 'active' : ''
  }

  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = (routes) => {
    const { classes, color, rtlActive } = this.props
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null
      }

      const navLinkClasses =
        classes.itemLink +
        ' ' +
        cx({
          [' ' + classes[color]]: this.activeRoute(prop.path),
        })
      const itemText =
        classes.itemText +
        ' ' +
        cx({
          [classes.itemTextMini]:
            this.props.miniActive && this.state.miniActive,
          [classes.itemTextMiniRTL]:
            rtlActive && this.props.miniActive && this.state.miniActive,
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
            to={prop.layout + prop.path}
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
  render() {
    const {
      classes,
      logo,

      logoText,
      routes,
      bgColor,
      rtlActive,
    } = this.props
    const itemText =
      classes.itemText +
      ' ' +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.itemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
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
    var user = (
      <div className={userWrapperClass}>
        <div className={photo}>
          <img src={avatar} className={classes.avatarImg} alt='...' />
        </div>
        <List className={classes.list}>
          <ListItem className={classes.item + ' ' + classes.userItem}>
            <NavLink
              to={'#'}
              className={classes.itemLink + ' ' + classes.userCollapseButton}
              onClick={() => {}}
            >
              <ListItemText
                primary={rtlActive ? 'تانيا أندرو' : 'Tania Andrew'}
                disableTypography={true}
                className={itemText + ' ' + classes.userItemText}
              />
            </NavLink>
          </ListItem>
        </List>
      </div>
    )
    var links = <List className={classes.list}>{this.createLinks(routes)}</List>

    const logoNormal =
      classes.logoNormal +
      ' ' +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
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
        <a
          href='https://www.creative-tim.com?ref=mdpr-sidebar'
          target='_blank'
          className={logoMini}
        >
          <img src={logo} alt='logo' className={classes.img} />
        </a>
        <a
          href='https://www.creative-tim.com?ref=mdpr-sidebar'
          target='_blank'
          className={logoNormal}
        >
          {logoText}
        </a>
      </div>
    )
    const drawerPaper =
      classes.drawerPaper +
      ' ' +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive,
      })
    const sidebarWrapper =
      classes.sidebarWrapper +
      ' ' +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
      })
    return (
      <div>
        <Hidden mdUp implementation='css'>
          <Drawer
            variant='temporary'
            anchor={rtlActive ? 'left' : 'right'}
            open={this.props.open}
            classes={{
              paper: drawerPaper + ' ' + classes[bgColor + 'Background'],
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {brand}
            <div className={sidebarWrapper}>
              {user}
              <AdminNavbarLinks rtlActive={rtlActive} />
              {links}
            </div>
          </Drawer>
        </Hidden>
        <Hidden smDown implementation='css'>
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? 'right' : 'left'}
            variant='permanent'
            open
            classes={{
              paper: drawerPaper + ' ' + classes[bgColor + 'Background'],
            }}
          >
            {brand}
            <div className={sidebarWrapper}>
              {user}
              {links}
            </div>
          </Drawer>
        </Hidden>
      </div>
    )
  }
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
