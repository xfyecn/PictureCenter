import React, { Component } from "react";
import { Link } from "react-router-dom"
import "./nav.css";

class Nav extends Component {
  render() {
    return (
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
    );
  }
}

export default Nav;
