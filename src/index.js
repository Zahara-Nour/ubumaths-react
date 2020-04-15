// import 'app/fonts/KaTeX_AMS-Regular.woff'
// import 'app/fonts/KaTeX_Caligraphic-Bold.woff'
// import 'app/fonts/KaTeX_Caligraphic-Regular.woff'
// import 'app/fonts/KaTeX_Fraktur-Regular.woff'
// import 'app/fonts/KaTeX_Fraktur-Bold.woff'
// import 'app/fonts/KaTeX_Main-Regular.woff'
// import 'app/fonts/KaTeX_Main-Bold.woff'
// import 'app/fonts/KaTeX_Main-BoldItalic.woff'
// import 'app/fonts/KaTeX_Main-Italic.woff'
// import 'app/fonts/KaTeX_Math-Italic.woff'
// import 'app/fonts/KaTeX_Math-BoldItalic.woff'
// import 'app/fonts/KaTeX_SansSerif-Bold.woff'
// import 'app/fonts/KaTeX_SansSerif-Regular.woff'
// import 'app/fonts/KaTeX_SansSerif-Italic.woff'
// import 'app/fonts/KaTeX_Size1-Regular.woff'
// import 'app/fonts/KaTeX_Size2-Regular.woff'
// import 'app/fonts/KaTeX_Size3-Regular.woff'
// import 'app/fonts/KaTeX_Size4-Regular.woff'
// import 'app/fonts/KaTeX_Script-Regular.woff'
// import 'app/fonts/KaTeX_Typewriter-Regular.woff'




import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import store from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
