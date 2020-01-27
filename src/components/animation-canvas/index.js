import React, { Component } from 'react';
import Canvas from './canvas';

/*
 based off of this article from Phil Nash https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/
*/

export default class AnimationCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = { angle: 0 };
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  updateAnimationState() {
    this.setState(prevState => ({ angle: prevState.angle + 1 }));
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    return <Canvas angle={this.state.angle} canvasWidth={this.props.canvasWidth} canvasHeight={this.props.canvasHeight}/>;
  }
}