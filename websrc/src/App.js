import React, { Component } from 'react'
import axios from 'axios'
import ImgItem from './components/imgItem'
import Lightbox from 'react-image-lightbox'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      pageNoShow: 1,
      pageNo: 1,
      pageSize: 30,
      photoIndex: 0,
      isOpen: false
    }
    this.handlePageNoChange = this.handlePageNoChange.bind(this)
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handlePrevPage = this.handlePrevPage.bind(this)
    this.handleNextPage = this.handleNextPage.bind(this)
    this.handleFirstPage = this.handleFirstPage.bind(this)
    this.handleLastPage = this.handleLastPage.bind(this)
    this.handler = this.handler.bind(this)
  }

  handlePageNoChange(event) {
    let value = event.target.value
    value = value.replace(/[^0-9]/ig,'')
    this.setState({pageNoShow: (value)*1})
  }

  handleInputKeyUp(event) {
    switch(event.key) {
      case 'Enter':
        this.handleSearch()
        break
      case 'ArrowRight':
        this.handleNextPage()
        break
      case 'ArrowDown':
        this.handleNextPage()
        break
      case 'ArrowLeft':
        this.handlePrevPage()
        break
      case 'ArrowUp':
        this.handlePrevPage()
        break
      default:
        break
    }
  }

  handleSearch() {
    this.setState({pageNo: this.state.pageNoShow})
  }

  handlePrevPage() {
    if(this.state.pageNo > 1) {
      this.setState({pageNoShow: this.state.pageNo-1})
      this.setState({pageNo: this.state.pageNo-1})
    }
  }

  handleNextPage() {
    let totalNum = Math.ceil(this.state.list.length / this.state.pageSize)
    if(this.state.pageNo < totalNum) {
      this.setState({pageNoShow: this.state.pageNo+1})
      this.setState({pageNo: this.state.pageNo+1})
    }
  }

  handleFirstPage() {
    this.setState({pageNoShow: 1})
    this.setState({pageNo: 1})
  }

  handleLastPage() {
    let totalNum = Math.ceil(this.state.list.length / this.state.pageSize)
    this.setState({pageNoShow: totalNum})
    this.setState({pageNo: totalNum})
  }

  handler(value) {
    this.setState({
      photoIndex: value,
      isOpen: true
    })
  }

  componentDidMount() {
    axios.get('/images/')
    .then(function (response) {
      if(response.data.arr) {
        this.setState({list: response.data.arr})
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error)
    })
  }

  render() {
    const {
        pageSize,
        pageNo,
        photoIndex,
        isOpen,
    } = this.state;
    const list = this.state.list.slice(pageNo * pageSize - pageSize, pageNo * pageSize)
    const listItems = list.map((item, i) =>
      <ImgItem key={item.uuid} src={item.thumbnailurl} name={item.filename} handler={this.handler} i={i} />
    )
    const images = list.map((item) =>
      item.fileurl
    )
    return (
      <div className="App">
        <div style={{textAlign:'center'}}>
          <button type="button" onClick={this.handleFirstPage} className="myButton">&lt;&lt;</button>
          <button type="button" onClick={this.handlePrevPage} className="myButton">&lt;</button>
          <input value={this.state.pageNoShow} onChange={this.handlePageNoChange} onKeyDown={this.handleInputKeyUp} className="pageNo" />
          <button type="button" onClick={this.handleSearch} className="myButton">Go!</button>
          <button type="button" onClick={this.handleNextPage} className="myButton">&gt;</button>
          <button type="button" onClick={this.handleLastPage} className="myButton">&gt;&gt;</button>
        </div>
        {listItems}
        <div style={{textAlign:'center'}}>
          <button type="button" onClick={this.handleFirstPage} className="myButton">&lt;&lt;</button>
          <button type="button" onClick={this.handlePrevPage} className="myButton">&lt;</button>
          <input value={this.state.pageNoShow} onChange={this.handlePageNoChange} onKeyDown={this.handleInputKeyUp} className="pageNo" />
          <button type="button" onClick={this.handleSearch} className="myButton">Go!</button>
          <button type="button" onClick={this.handleNextPage} className="myButton">&gt;</button>
          <button type="button" onClick={this.handleLastPage} className="myButton">&gt;&gt;</button>
        </div>
        {isOpen &&
          <Lightbox
              mainSrc={images[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}

              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() => this.setState({
                  photoIndex: (photoIndex + images.length - 1) % images.length,
              })}
              onMoveNextRequest={() => this.setState({
                  photoIndex: (photoIndex + 1) % images.length,
              })}
          />
        }
      </div>
    )
  }
}

export default App
