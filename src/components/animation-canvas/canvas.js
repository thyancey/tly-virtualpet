import React, { Component } from 'react';
import HookCanvas from './hook-canvas';


export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.saveCanvasContext = this.saveCanvasContext.bind(this);
  }

  saveCanvasContext(ctx) {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
  }


  componentDidUpdate() {
    if(this.ctx){
      this.props.drawCommands.forEach(dC => {
        dC(this.ctx, { ...this.props });
      });
    }
  }

  render() {
    // console.log('R: Canvas');
    return (
      <HookCanvas 
        onSetCanvasRef={this.saveCanvasContext} 
        canvasWidth={this.props.canvasWidth} 
        canvasHeight={this.props.canvasHeight}
        onStageClick={this.props.onStageClick} />
    );
  }
}