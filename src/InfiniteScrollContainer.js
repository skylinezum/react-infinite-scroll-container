import { throttle, merge, cloneDeep } from 'lodash';
import React        from 'react';

const PADDING  = 100;
const INTERVAL = 300;

const STYLE = {
  outer : {
    position  : 'absolute',
    top       : 0,
    left      : 0,
    width     : '100%',
    height    : '100%',
    margin    : 0,
    padding   : 0,
    overflowY : 'auto',
  },
  inner : {
    width : '100%',
  },
};

/**
 * 無限リスト用のラッパー
 * スクロールイベントだけを管理する
 */
class InfiniteScrollContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.mergeStyle(this.props);
  }

  componentDidMount () {
    this._interval = Number.isFinite(this.props.interval) ? +this.props.interval : INTERVAL;
    this._padding  = Number.isFinite(this.props.padding) ? +this.props.padding   : PADDING;
    this._onScroll = throttle((e) => this.onScroll(e), this._interval);
    this.refs.outer.addEventListener('scroll', this._onScroll);
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.mergeStyle(nextProps));
  }

  componentWillUnmount () {
    this.refs.outer.removeEventListener('scroll', this._onScroll);
    this._onScroll = null;  // 循環参照しているため、明示的に破棄する
  }

  mergeStyle (props) {
    const hasNoStyle = (props.style == null);
    let cloneOuter = cloneDeep(STYLE.outer);
    let cloneInner = cloneDeep(STYLE.inner);
    const outerStyle = (hasNoStyle || !props.style.hasOwnProperty('outer')) ? STYLE.outer : merge(cloneOuter, props.style.outer);
    const innerStyle = (hasNoStyle || !props.style.hasOwnProperty('inner')) ? STYLE.inner : merge(cloneInner, props.style.inner);
    return {
      outer: outerStyle,
      inner: innerStyle,
    };
  }

  onScroll (e) {
    if (this.props.disabled) { return; }

    const target    = e.target;
    const remaining = target.scrollHeight - (target.clientHeight + target.scrollTop);

    if (remaining < this._padding) {
      this.props.onScroll();
    }
  }

  render () {
    return (
      <div className="InfiniteScroll" ref="outer"
        style={this.state.outer}
        onScroll={this._onScroll}>
        <div className="InfiniteScroll__Inner" style={this.state.inner}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

InfiniteScrollContainer.propTypes = {
  style    : React.PropTypes.object,
  children : React.PropTypes.node,
  disabled : React.PropTypes.bool,
  padding  : React.PropTypes.number,
  interval : React.PropTypes.number,
  onScroll : React.PropTypes.func.isRequired,
};

export default InfiniteScrollContainer;
