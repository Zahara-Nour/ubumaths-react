import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app/App'
import { store, persistore } from './app/store'
// import store from './app/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import * as serviceWorker from './app/serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/browser'
import {version} from '../package.json'


if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://86906891d533413d89c6b74f6d528727@o397779.ingest.sentry.io/5252881',
    release: version,
  })
  LogRocket.init('7mzcdm/ubumaths', {
    release: version
  })
  // LogRocket.getSessionURL((sessionURL) => {
  //   Sentry.configureScope((scope) => {
  //     scope.setExtra('sessionURL', sessionURL)
  //   })
  // })
}

const hist = createBrowserHistory()


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} history={hist}>
      <PersistGate loading={null} persistor={persistore}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
