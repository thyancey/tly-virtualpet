import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimationCanvas from '../animation-canvas/';
import { getAnimation } from '../animation-canvas/_animations';

import { themeGet } from 'themes/';

import {
  setActivity
} from '../../store/actions/pet';
import { 
  selectActivePetAnimation,
} from '../../store/selectors';

const $PetContainer = styled.div`
  position:relative;
  height: 100%;
`;

class Pet extends Component {
  constructor(props){
    super(props);
    this.idleTimer = null;
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      posX: 0,
      posY: 480
    }
    global.document.addEventListener('keydown', this.onKeyDown);
  }

  movePet(x, y){
    this.setState({ 
      posX: this.state.posX + x,
      posY: this.state.posY + y 
    });

    this.startWalking();
  }

  stopWalking(){
    this.props.setActivity('IDLE');
  }

  startWalking(){
    this.props.setActivity('WALK');

    //- TODO, use debounce, but not of the npm modules worked for some reason
    this.startIdleTimer();
  }

  startIdleTimer(){
    this.killIdleTimer();
    this.idleTimer = global.setTimeout(() => {
      this.stopWalking()
    }, 200)
  }

  killIdleTimer(){
    if(this.idleTimer){
      global.clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  onKeyDown(e){
    switch(e.code){
      case 'ArrowRight': 
        this.movePet(10, 0);
        break;
      case 'ArrowLeft':
        this.movePet(-10, 0);
        break;
      case 'ArrowUp':
        this.movePet(0, -10);
        break;
      case 'ArrowDown':
        this.movePet(0, 10);
        break;
      default:
    }
  }

  getDrawCommand(type, newBounds, newPosition){
    return (ctx, bounds, position, props) => getAnimation(type)(ctx, newBounds, newPosition, props);
  }

  render(){
    const { petData, animation, containerWidth, containerHeight } = this.props;

    let drawCommand = null;
    if(animation.type){
      drawCommand = this.getDrawCommand(animation.type, [ containerWidth, containerHeight], [ this.state.posX, this.state.posY ]);
    }

    return (
      <$PetContainer>
        <AnimationCanvas containerWidth={containerWidth} containerHeight={containerHeight} animation={animation} drawCommand={drawCommand} />
      </$PetContainer>
    );
  }
}


const mapStateToProps = (state) => ({
  animation: selectActivePetAnimation(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    { setActivity },
    dispatch
  )
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pet);
