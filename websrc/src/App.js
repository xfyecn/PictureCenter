import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom"
import Nav from './components/nav/nav'
import Debug from './components/debug/debug'
import PicList from './components/pic-list/pic-list'
import PicUpload from './components/pic-upload/pic-upload'
import 'react-image-lightbox/style.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Nav></Nav>
          <Route exact path="/" component={PicList} />
          <Route exact path="/upload" component={PicUpload} />
          <Route exact path="/debug" component={Debug} />
        </div>
      </Router>
    )
  }
}

export default App
