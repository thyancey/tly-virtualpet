import React, { Component } from 'react';

export default class PureCanvas extends Component {
  shouldComponentUpdate(nextProps) {
    if(nextProps.canvasWidth !== this.props.canvasWidth || nextProps.canvasHeight !== this.props.canvasHeight){
      return true;
    }
    return false;
  }

  render() {
    // console.log('R: PureCanvas');
    return (
      <canvas
        width={this.props.canvasWidth}
        height={this.props.canvasHeight}
        ref={node =>
          node ? this.props.contextRef(node.getContext('2d')) : null
        }
      />
    );
  }
}