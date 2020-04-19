import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app/App'
import store from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './app/serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

const hist = createBrowserHistory()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} history={hist}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
