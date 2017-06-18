import React, { Component } from 'react'

class ImgItem extends Component {
  render() {
    return (
      <div className="img-item" onClick={() => this.props.handler(this.props.i)}>
        <img src={this.props.src} className="img" alt="img" />
        <p>{this.props.name}</p>
      </div>
    )
  }
}

export default ImgItem
