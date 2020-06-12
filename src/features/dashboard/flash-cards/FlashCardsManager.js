import React from 'React'
import { Switch, Route } from 'react-router-dom'
import EditCards from './EditCards'
// import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { selectIsAdmin } from 'features/auth/authSlice'

function FlashCardsManager({ match, location }) {
  const isAdmin = useSelector(selectIsAdmin)
  // const values = queryString.parse(location.search)


  return (
    <Switch>
      <Route exact path={`${match.url}`} render={() => <Home />} />
      <Route exact path={`${match.url}/edit`} component={EditCards}></Route>
      <Route
        path={
          isAdmin
            ? `${match.url}/edit/:subject/:domain/:theme/:name`
            : `${match.url}/edit/:subject/:theme/:name`
        }
        render={({ match }) => {
          const filters = []
          const parameters = isAdmin
            ? ['subject', 'domain', 'theme', 'name']
            : ['subject', 'theme', 'name']
          for (const param of parameters) {
            if (match.params[param])
              filters.push({ [param]: match.params[param] })
          }

          return <EditCards filters={filters}/>
        }}
      />

      <Route render={() => <h1>Erreur</h1>} />
    </Switch>
  )
}

function Home() {
  return <div>Cardmanager</div>
}

export default FlashCardsManager
