import React, { Component } from 'react';
import Canvas from './canvas';

/*
 some based off of this article from Phil Nash https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/
*/
export default class AnimationCanvas extends Component {
  constructor(props) {
    super(props);
    this.frames = 0;

    this.state = { 
      tick: 0,
      img: null,
      overlayImg: null,
      loadStarted: false
     };
  }

  updateImage(imageUrl, overlayUrl){
    if(imageUrl || overlayUrl){
      this.setState({ 'loadStarted': true });
    }
    if(imageUrl){
      let img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        this.setState({
          img: img
        });
      };
    }else{
      this.setState({ imageUrl: null })
    }
    
    if(overlayUrl){
      let img = new Image();
      img.src = overlayUrl;

      img.onload = () => {
        this.setState({
          overlayImg: img
        });
      };
    }else{
      this.setState({ overlayImg: null })
    }
  }

  componentDidUpdate(prevProps){
    const { imageUrl, overlayUrl } = this.props.animation;
    
    if(imageUrl){
      if(prevProps.animation.imageUrl !== imageUrl || prevProps.animation.overlayUrl !== overlayUrl){
        this.updateImage(imageUrl, overlayUrl);
      }else{
        if(!this.state.img && !this.state.loadStarted){
          this.updateImage(imageUrl, overlayUrl);
        }
      }
    }

  }

  render() {
    return (
      <Canvas 
        tick={this.props.tick} 
        canvasWidth={this.props.containerWidth} 
        canvasHeight={this.props.containerHeight}
        sprite={this.state.img}
        overlaySprite={this.state.overlayImg}
        spriteInfo={this.props.animation.spriteInfo}
        direction={this.props.direction}
        onStageClick={this.props.onStageClick}
        drawCommands={ this.props.drawCommands } />
    );

  }
}
