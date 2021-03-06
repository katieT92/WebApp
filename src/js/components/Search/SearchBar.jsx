import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { blurTextFieldAndroid, cordovaDot, focusTextFieldAndroid } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
// Dec 2019 TODO: This is the last icon from the svg-icons package used in the Web App, all the other have been removed from git
import removeCircleIcon from '../../../img/global/svg-icons/glyphicons-pro-halflings/glyphicons-halflings-88-remove-circle.svg';

export default class SearchBar extends Component {
  static propTypes = {
    clearButton: PropTypes.bool,
    clearFunction: PropTypes.func.isRequired,
    clearSearchTextNow: PropTypes.bool,
    placeholder: PropTypes.string,
    searchButton: PropTypes.bool,
    searchFunction: PropTypes.func.isRequired,
    searchUpdateDelayTime: PropTypes.number.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      searchString: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
  }

  componentDidMount () {
    // console.log("SearchBar, this.props.clearSearchTextNow:", this.props.clearSearchTextNow);
    if (this.props.clearSearchTextNow) {
      this.props.clearFunction();
      this.setState({
        searchString: '',
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("SearchBar, nextProps.clearSearchTextNow:", nextProps.clearSearchTextNow);
    if (nextProps.clearSearchTextNow) {
      this.props.clearFunction();
      this.setState({
        searchString: '',
      });
    }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  clearQuery () {
    this.props.clearFunction();
    this.setState({ searchString: '' });
  }

  handleKeyPress () {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.searchFunction(this.state.searchString);
    }, this.props.searchUpdateDelayTime);
  }

  updateResults (event) {
    const searchString = event.target.value;
    this.setState({
      searchString,
    });
  }

  render () {
    renderLog('SearchBar');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div className="search-bar clearfix">
        <input
          id="search_input"
          type="text"
          className="form-control"
          placeholder={this.props.placeholder}
          value={this.state.searchString}
          onKeyDown={this.handleKeyPress}
          onChange={this.updateResults}
          onFocus={focusTextFieldAndroid}
          onBlur={blurTextFieldAndroid}
        />
        <div className="search-bar-options">
          <button
            className={this.props.clearButton && this.state.searchString && this.state.searchString.length > 0 ? 'search-options-btn' : 'hidden'}
            onClick={this.clearQuery}
            type="button"
          >
            <img src={cordovaDot(removeCircleIcon)} width="28" height="28" color="#ccc" alt="clear query" />
          </button>
          <button
            className={this.props.searchButton ? 'search-options-btn' : 'hidden'}
            type="button"
          >
            <i className="fas fa-search" />
          </button>
        </div>
      </div>
    );
  }
}
