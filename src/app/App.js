import React from 'react'
import './App.scss'
import Nav from 'components/Nav'
import { Switch, Route } from 'react-router-dom'
import Mental from 'features/mental/Mental'

//import style from '@edtr-io/mathquill/build/mathquill.css'
//console.log(style)
// put mathquill css in HTML heade
  // if (document.getElementById('react-mathquill-styles') == null) {
  //   const styleTag = document.createElement('style')
  //   styleTag.setAttribute('id', 'react-mathquill-styles')
  //   styleTag.innerHTML = style[0][1]

  //   const head = document.getElementsByTagName('head')[0]
  //   head.appendChild(styleTag)
  // }


function App() {
  return (
    <>
      <div className="App">
        <Nav />
      </div>
      {/* <Switch>
        <Route path='/calcu-mental' component={Mental} />
      </Switch> */}
      <Mental />
    </>
  )
}

export default App
