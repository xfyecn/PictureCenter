import React, { Component } from 'react'
import axios from 'axios'
import './debug.css'

class Debug extends Component {
  constructor(props) {
    super(props)
    this.restoreDB = this.restoreDB.bind(this)
    this.queryDB = this.queryDB.bind(this)
  }

	restoreDB() {
    axios.get('/images/restoreDB')
    .then(function (response) {
      alert(response.data.message)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

	queryDB() {
    axios.get('/images/')
    .then(function (response) {
			console.log(response.data)
			document.getElementById('info').innerHTML = JSON.stringify(response.data)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  render() {
    return (
      <div>
        <input value="query saved images" type="button" onClick={this.queryDB} />
        <input value="restore database" type="button" onClick={this.restoreDB} />
        <div id="info"></div>
      </div>
    )
  }
}

export default Debug
