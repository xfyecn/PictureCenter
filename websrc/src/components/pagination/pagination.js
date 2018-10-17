import React, { Component } from "react";
import "./pagination.css";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNoShow: 1,
    };
    this.handlePageNoChange = this.handlePageNoChange.bind(this);
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleFirstPage = this.handleFirstPage.bind(this);
    this.handleLastPage = this.handleLastPage.bind(this);
  }

  handleProp(pageNo) {
    this.props.handlePagination(pageNo);
  }

  handlePageNoChange(event) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/gi, "");
    const pageNo = value * 1;
    if (pageNo > 0 && pageNo <= Math.ceil(this.props.totalPages / this.props.pageSize)) {
      this.setState({ pageNoShow: pageNo });
    }
  }

  handleInputKeyUp(event) {
    switch (event.key) {
      case "Enter":
        this.handleSearch();
        break;
      case "ArrowRight":
        this.handleNextPage();
        break;
      case "ArrowDown":
        this.handleNextPage();
        break;
      case "ArrowLeft":
        this.handlePrevPage();
        break;
      case "ArrowUp":
        this.handlePrevPage();
        break;
      default:
        break;
    }
  }

  handleSearch() {
    this.handleProp(this.state.pageNoShow);
  }

  handlePrevPage() {
    if (this.props.pageNo > 1) {
      this.setState({ pageNoShow: this.props.pageNo - 1 });
      this.handleProp(this.props.pageNo - 1);
    }
  }

  handleNextPage() {
    const totalNum = Math.ceil(this.props.totalPages / this.props.pageSize);
    if (this.props.pageNo < totalNum) {
      this.setState({ pageNoShow: this.props.pageNo + 1 });
      this.handleProp(this.props.pageNo + 1);
    }
  }

  handleFirstPage() {
    this.setState({ pageNoShow: 1 });
    this.handleProp(1);
  }

  handleLastPage() {
    const totalNum = Math.ceil(this.props.totalPages / this.props.pageSize);
    this.setState({ pageNoShow: totalNum });
    this.handleProp(totalNum);
  }

  componentWillReceiveProps(nextProps) {
    this.state.pageNoShow = nextProps.pageNo;
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={this.handleFirstPage}
          className="paginationBtn"
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          onClick={this.handlePrevPage}
          className="paginationBtn"
        >
          &lt;
        </button>
        <input
          value={this.state.pageNoShow}
          onChange={this.handlePageNoChange}
          onKeyDown={this.handleInputKeyUp}
          className="pageNo"
        />
        <button
          type="button"
          onClick={this.handleSearch}
          className="paginationBtn"
        >
          Go!
        </button>
        <button
          type="button"
          onClick={this.handleNextPage}
          className="paginationBtn"
        >
          &gt;
        </button>
        <button
          type="button"
          onClick={this.handleLastPage}
          className="paginationBtn"
        >
          &gt;&gt;
        </button>
      </div>
    );
  }
}

export default Pagination;
