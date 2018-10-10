import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Debug from './components/debug/debug'
import PicList from './components/pic-list/pic-list'
import PicUpload from './components/pic-upload/pic-upload'
import 'react-image-lightbox/style.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div class="app">
          <ul>
            <li>
              <Link to="/">Gallery</Link>
            </li>
            <li>
              <Link to="/upload">Upload images</Link>
            </li>
            <li>
              <Link to="/debug">Debug</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={PicList} />
          <Route exact path="/upload" component={PicUpload} />
          <Route exact path="/debug" component={Debug} />
        </div>
      </Router>
    )
  }
}

export default App
