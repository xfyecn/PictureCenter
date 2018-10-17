import React, { Component } from "react";
import axios from "axios";
import Pagination from "../pagination/pagination";
import ImgItem from "./pic-item/pic-item";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./pic-list.css";

class PicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pageNo: 1,
      pageSize: 40,
      photoIndex: 0,
      isOpen: false
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.handler = this.handler.bind(this);
  }

  handlePagination(value) {
    this.setState({ pageNo: value });
  }

  handler(value) {
    this.setState({
      photoIndex: value,
      isOpen: true
    });
  }

  componentDidMount() {
    axios
      .get("/images/")
      .then(
        (response) => {
          if (response.data.arr) {
            this.setState({ list: response.data.arr });
          }
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { pageSize, pageNo, photoIndex, isOpen } = this.state;
    const list = this.state.list.slice(
      pageNo * pageSize - pageSize,
      pageNo * pageSize
    );
    const listItems = list.map((item, i) => (
      <ImgItem
        key={item.uuid}
        src={item.thumbnailurl}
        name={item.filename}
        handler={this.handler}
        i={i}
      />
    ));
    const images = list.map(item => item.fileurl);
    return (
      <div className="pic-list">
        {listItems.length > 0 && (
          <Pagination
            pageNo={this.state.pageNo}
            pageSize={this.state.pageSize}
            totalPages={this.state.list.length}
            handlePagination={this.handlePagination}
          />
        )}
        <div className="list-wrapper">{listItems}</div>
        {listItems.length > 0 && (
          <Pagination
            pageNo={this.state.pageNo}
            pageSize={this.state.pageSize}
            totalPages={this.state.list.length}
            handlePagination={this.handlePagination}
          />
        )}
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length
              })
            }
          />
        )}
      </div>
    );
  }
}

export default PicList;
