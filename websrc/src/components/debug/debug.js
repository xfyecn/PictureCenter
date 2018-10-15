import React, { Component } from "react";
import axios from "axios";
import "./debug.css";

class Debug extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      count: 0
    };
    this.restoreDB = this.restoreDB.bind(this);
  }

  restoreDB() {
    if (window.confirm("Are you sure you want to restore database?")) { 
      axios
        .get("/images/restoreDB")
        .then((response) => {
          alert(response.data.message);
          this.queryDB();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  queryDB() {
    axios
      .get("/images/")
      .then(
        (response) => {
          if (response.data.arr) {
            this.setState({ list: response.data.arr });
            this.setState({ count: response.data.picCount });
          }
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.queryDB();
  }

  render() {
    const list = this.state.list;
    const listItems = list.map((item, i) => (
      <div key={i} className="item">
        <div>filename: {item.filename}</div>
        <div>filepath: {item.filepath}</div>
        <div>fileurl: {item.fileurl}</div>
      </div>
    ));
    return (
      <div className="wrapper">
        <div>
          <input
            value="restore database"
            type="button"
            onClick={this.restoreDB}
          />
        </div>
        Total: {this.state.count}
        {listItems}
      </div>
    );
  }
}

export default Debug;
