import React from 'react'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components
import NavBar from 'components/NavBar'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import styles from 'assets/jss/layouts/mental'

import { useSelector } from 'react-redux'
import { selectReady } from './mentalSlice'
import { selectUser } from 'features/auth/authSlice'
// import Assessment from './Assessment'
import QuestionsList from './QuestionsList'
import Basket from './Basket'
import Assessment from './Assessment'
import AssignedAssessments from './AssignedAssessments'

const useStyles = makeStyles(styles)

function Mental(props) {
  const { ...rest } = props
  // ref for the wrapper div
  const ready = useSelector(selectReady)
  const user = useSelector(selectUser)

  // styles
  const classes = useStyles()

  // // otherwise Burger disappears in low width
  // React.useEffect(() => {
  //   document.body.style.overflow = 'unset'

  //   return function cleanup() {}
  // })

  if (ready) return <Assessment />

  return (
    <div>
      <NavBar {...rest} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <QuestionsList />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          {user.role === 'teacher' && <Basket />}
          {user.role === 'student' && (
                <AssignedAssessments userId={user.email} />
              )}
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default Mental
