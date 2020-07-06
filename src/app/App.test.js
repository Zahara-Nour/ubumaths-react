import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'
import { store, persistore } from 'app/store'
// import store from './app/store'

const hist = createBrowserHistory()

it('renders welcome message', () => {
 render(
    <React.StrictMode>
    <Provider store={store} history={hist}>
      <PersistGate loading={null} persistor={persistore}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
  );

 

  expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
});
