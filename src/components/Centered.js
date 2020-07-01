import React from 'react'
import { makeStyles } from '@material-ui/core'
import styles from 'assets/jss/centeredStyle'

const useStyles = makeStyles(styles)

function Centered ({children}) {
    const classes = useStyles()

    return <div className={classes.centered}>
        {children}
    </div>


}


export default Centered