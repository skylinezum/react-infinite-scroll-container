'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _lodash = require('lodash');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PADDING = 100;
var INTERVAL = 300;

var STYLE = {
  outer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    overflowY: 'auto'
  },
  inner: {
    width: '100%'
  }
};

/**
 * 無限リスト用のラッパー
 * スクロールイベントだけを管理する
 */

var InfiniteScrollContainer = (function (_React$Component) {
  _inherits(InfiniteScrollContainer, _React$Component);

  function InfiniteScrollContainer(props) {
    _classCallCheck(this, InfiniteScrollContainer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InfiniteScrollContainer).call(this, props));

    _this.state = _this.mergeStyle(_this.props);
    return _this;
  }

  _createClass(InfiniteScrollContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this._interval = Number.isFinite(this.props.interval) ? +this.props.interval : INTERVAL;
      this._padding = Number.isFinite(this.props.padding) ? +this.props.padding : PADDING;
      this._onScroll = (0, _lodash.throttle)(function (e) {
        return _this2.onScroll(e);
      }, this._interval);
      this.refs.outer.addEventListener('scroll', this._onScroll);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(this.mergeStyle(nextProps));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.refs.outer.removeEventListener('scroll', this._onScroll);
      this._onScroll = null; // 循環参照しているため、明示的に破棄する
    }
  }, {
    key: 'mergeStyle',
    value: function mergeStyle(props) {
      var hasNoStyle = props.style == null;
      var cloneOuter = (0, _lodash.cloneDeep)(STYLE.outer);
      var cloneInner = (0, _lodash.cloneDeep)(STYLE.inner);
      var outerStyle = hasNoStyle || !props.style.hasOwnProperty('outer') ? STYLE.outer : (0, _lodash.merge)(cloneOuter, props.style.outer);
      var innerStyle = hasNoStyle || !props.style.hasOwnProperty('inner') ? STYLE.inner : (0, _lodash.merge)(cloneInner, props.style.inner);
      return {
        outer: outerStyle,
        inner: innerStyle
      };
    }
  }, {
    key: 'onScroll',
    value: function onScroll(e) {
      if (this.props.disabled) {
        return;
      }

      var target = e.target;
      var remaining = target.scrollHeight - (target.clientHeight + target.scrollTop);

      if (remaining < this._padding) {
        this.props.onScroll();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'InfiniteScroll', ref: 'outer',
          style: this.state.outer,
          onScroll: this._onScroll },
        _react2.default.createElement(
          'div',
          { className: 'InfiniteScroll__Inner', style: this.state.inner },
          this.props.children
        )
      );
    }
  }]);

  return InfiniteScrollContainer;
})(_react2.default.Component);

InfiniteScrollContainer.propTypes = {
  style: _react2.default.PropTypes.object,
  children: _react2.default.PropTypes.node,
  disabled: _react2.default.PropTypes.bool,
  padding: _react2.default.PropTypes.number,
  interval: _react2.default.PropTypes.number,
  onScroll: _react2.default.PropTypes.func.isRequired
};

exports.default = InfiniteScrollContainer;