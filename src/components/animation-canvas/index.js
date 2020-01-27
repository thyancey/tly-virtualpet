import React, { Component } from 'react';
import Canvas from './canvas';
import { getAnimation } from './_animations';

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

  updateImage(aObj){
    if(aObj.imageUrl){
      let img = new Image();
      img.src = aObj.imageUrl;
      img.onload = () => {
        console.log('new img')
        this.setState({
          img: img
        });
      };
    }else{
      return null;
    }

  }

  componentDidUpdate(prevProps){
    if(this.props.animation.label && (prevProps.animation.label !== this.props.animation.label || !this.state.img)){
      this.updateImage(this.props.animation);
    }
  }

  render() {
    return <Canvas 
              tick={this.state.tick} 
              canvasWidth={this.props.canvasWidth} 
              canvasHeight={this.props.canvasHeight}
              sprite={this.state.img}
              spriteInfo={this.props.animation.spriteInfo}
              drawCommand={ getAnimation(this.props.animation.type) } />;
  }
}
