import React, { Component } from 'react';
import PureCanvas from './pure-canvas';


export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
  }

  componentDidUpdate() {
    this.props.drawCommand && this.props.drawCommand(this.ctx, this.width, this.height, { ...this.props });
    
  }

  render() {
    return <PureCanvas contextRef={this.saveContext} canvasWidth={this.props.canvasWidth} canvasHeight={this.props.canvasHeight}/>;
  }
}