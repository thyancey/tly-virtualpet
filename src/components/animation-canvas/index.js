import React, { Component } from 'react';
import Canvas from './canvas';

/*
 based off of this article from Phil Nash https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/
*/

//- should be at least 1. Increase to reduce the number of cycles per animationLoop
const FRAME_RATE = 1;

export default class AnimationCanvas extends Component {
  constructor(props) {
    super(props);
    this.frames = 0;

    this.state = { 
      tick: 0,
      img: null
     };
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  updateAnimationState() {
    if(this.frames % FRAME_RATE === 0){
      this.setState(prevState => ({ 
        tick: this.frames 
      }));
    }

    this.frames++;
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  updateImage(imageUrl){
    if(imageUrl){
      let img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        this.setState({
          img: img
        });
      };
    }else{
      return null;
    }

  }

  componentDidUpdate(prevProps){
    const { imageUrl } = this.props.animation;
    if(imageUrl && (prevProps.animation.imageUrl !== imageUrl || !this.state.img)){
      this.updateImage(imageUrl);
    }
  }

  render() {
    return <Canvas 
              tick={this.state.tick} 
              canvasWidth={this.props.containerWidth} 
              canvasHeight={this.props.containerHeight}
              sprite={this.state.img}
              position={this.props.position}
              spriteInfo={this.props.animation.spriteInfo}
              drawCommand={ this.props.drawCommand } />;
  }
}
