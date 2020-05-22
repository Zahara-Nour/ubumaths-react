import React from 'React'
import { Switch, Route } from 'react-router-dom'
import Edit from 'features/dashboard/Edit'


function FlashCardsManager({match}) {

    return ( <Switch>
     
        <Route exact path={`${match.url}`} render={() => <Home />} />
        <Route path={`${match.url}/edit`} component={Edit} />
        {/* <Route path={`${match.url}/create`} component={CreateFlashCard} />
        <Route path={`${match.url}/theme/:subject/:theme`} component={DisplayFlashCards} /> */}
        <Route render={() => <h1>Erreur</h1>} />
      </Switch>)
}


function Home() {


    return <div>Cardmanager</div>
}

export default FlashCardsManager