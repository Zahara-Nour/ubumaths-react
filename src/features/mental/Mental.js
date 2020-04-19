import React from 'react'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components
import NavBar from 'components/NavBar'

import styles from 'assets/jss/layouts/mental.js'

const useStyles = makeStyles(styles)

function Mental(props) {
  const { ...rest } = props
  // ref for the wrapper div

  // styles
  const classes = useStyles()

  // otherwise Burger disappears in low width
  React.useEffect(() => {
    document.body.style.overflow = 'unset'
    // Specify how to clean up after this effect:
    return function cleanup() {}
  })

  return (
    <div>
      <NavBar {...rest} />
    </div>
  )
}

export default Mental
