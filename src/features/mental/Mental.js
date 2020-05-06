import React from 'react'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

import { Switch, Route, Link } from 'react-router-dom'
import questions from './questions.json'

// core components
import NavBar from 'components/NavBar'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import styles from 'assets/jss/layouts/mental'

import { useSelector, useDispatch } from 'react-redux'
import {
  selectReady,
  addToBasket,
  setBasket,
  launchAssessment,
} from './mentalSlice'
import { selectUser } from 'features/auth/authSlice'
// import Assessment from './Assessment'
import QuestionsList from './QuestionsList'
import Basket from './Basket'
import Assessment from './Assessment'
import AssignedAssessments from './AssignedAssessments'

const useStyles = makeStyles(styles)

function Mental({ match, ...rest }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  // ref for the wrapper div

  // styles
  const classes = useStyles()

  // // otherwise Burger disappears in low width
  // React.useEffect(() => {
  //   document.body.style.overflow = 'unset'

  //   return function cleanup() {}
  // })

  return (
    <Switch>
      <Route exact path={`${match.url}`} render={() => <Home {...rest} />} />
      <Route
        path={`${match.url}/:category/:subcategory/:subsubcategory/:level`}
        render={({ match }) => {
          console.log(questions)
          const category = questions.find(
            (category) => category.label === match.params.category,
          )
          console.log('category', category)
          const subcategory = category.subcategories.find(
            (subcategory) => subcategory.label === match.params.subcategory,
          )
          console.log('subcategory', subcategory)
          const subsubcategory = subcategory.subsubcategories.find(
            (subsubcategory) => subsubcategory.label === match.params.subsubcategory,
          )
          console.log('subsubcategory', subsubcategory)
         
          const question =subsubcategory.levels[match.params.level-1]

          question.id = `${match.category} - ${match.subcategory} - Niveau ${
            match.level + 1
          }`
          question.delay = question.defaultDelay*1000

          const list = []
          for (let i = 0; i < 10; i++) {
            list.push(question)
          }
          dispatch(setBasket({ questions: list }))
          dispatch(launchAssessment({ marked: false }))

          return <Assessment match={match} />
        }}
      />
      <Route render={() => <h1>Erreur</h1>} />
    </Switch>
  )
}

function Home({ props }) {
  const ready = useSelector(selectReady)
  const user = useSelector(selectUser)

  if (ready) return <Assessment />

  return (
    <div>
      <NavBar {...props} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <QuestionsList />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          {user.role === 'teacher' && <Basket />}
          {user.role === 'student' && <AssignedAssessments />}
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default Mental
