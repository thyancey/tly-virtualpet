import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimationCanvas from '../animation-canvas/';
import { getAnimation } from '../animation-canvas/_animations';

import { themeGet } from 'themes/';

import { clamp } from 'util/tools';

import {
  setActivity
} from '../../store/actions/pet';
import { 
  selectActivePetActivity,
  selectActivePetAnimation,
  selectActiveSceneFloorOffset,
  selectCurrentPetBehavior
} from '../../store/selectors';

const $PetContainer = styled.div`
  position:relative;
  height: 100%;
`;

const FRAME_RATE = 1;
const DRAG_Y = .99;
const DRAG_X = .8;
const FALL_Y = 1;

class Pet extends Component {
  constructor(props){
    super(props);
    this.idleTimer = null;
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.vX = 0;
    this.vY = 0;
    this.aY = 1.08;

    // this.frames = 0;
    this.rAF = 0;
    this.updateAnimationState = this.updateAnimationState.bind(this);


    this.keysDown = [];

    this.state = {
      // tick: 0,
      posX: 0,
      posY: 0,
      minY: 0,
      maxY: 0,
      minX: 0,
      maxX: 0,
      isOnGround: false,
      direction: 1
    }
    global.document.addEventListener('keyup', this.onKeyUp);
    global.document.addEventListener('keydown', this.onKeyDown);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
    this.resetPetPosition();
  }

  updateAnimationState() {
    // if(this.frames % FRAME_RATE === 0){
    //   this.setState(prevState => ({ 
    //     tick: this.frames 
    //   }));
    // }
    
    // console.log('tick');
    this.checkKeys();
    this.affectPetGravity();


    // this.frames++;
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }



  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  jumpPet(amount){
    if(this.state.isOnGround){
      this.vY -= amount;
    }
  }

  movePet(x, y){
    this.vY += y;
    this.vX += x;

    if(x < 0){
      this.setState({
        direction: -1
      });
    }else if(x > 0){
      this.setState({
        direction: 1
      });
    }

    this.startWalking();
  }

  stopWalking(){
    if(this.props.activity !== 'IDLE'){
      this.props.setActivity('IDLE');
    }
  }

  startWalking(){
    if(this.props.activity !== 'WALK'){
      this.props.setActivity('WALK');
    }

    //- TODO, use debounce, but none of the npm modules worked for some reason
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

  checkKeys(){
    this.keysDown.forEach(k => {
      switch(k){
        case 'ArrowRight': 
          this.movePet(1, 0);
          break;
        case 'ArrowLeft':
          this.movePet(-1, 0);
          break;
        case 'ArrowUp':
          this.jumpPet(20);
          break;
        case 'ArrowDown':
          this.movePet(0, 1);
          break;
        default:
      }
    })
  }

  onKeyUp(e){
    const foundIdx = this.keysDown.indexOf(e.code);
    if(foundIdx > -1){
      this.keysDown.splice(foundIdx, 1);
    }
  }

  onKeyDown(e){
    if(this.keysDown.indexOf(e.code) === -1){
      this.keysDown.push(e.code);
    }
  }

  getDrawCommand(type, newBounds, newPosition, newDirection){
    return (ctx, props) => getAnimation(type)(ctx, newBounds, newPosition, newDirection, props);
  }

  affectPetGravity(){
    /* gravity stuff */
    this.vY = this.vY + FALL_Y;

    if(this.vY < 1 && this.vY > 0){
      this.vY = 0;
    }else{
      this.vY *= DRAG_Y;
    }

    if(this.vX < 1 && this.vX > -1){
      this.vX = 0;
    }else{
      this.vX *= DRAG_X;
    }

    //- check for sitting on ground, staying in container
    const newY = this.state.posY + this.vY;
    if(newY >= this.state.maxY){
      this.vY = 0;
    }

    const newX = this.state.posX + this.vX;
    if(newX >= this.state.maxX){
      this.vX = 0;
    }else if(newX < this.state.minX){
      this.vX = 0;
    }


    const clampedX = clamp(newX, this.state.minX, this.state.maxX);
    // const clampedY = clamp(newY, this.state.minY, this.state.maxY);
    //- dont clamp top so they can jump real high
    const clampedY = Math.min(newY, this.state.maxY);
    
    this.attemptToUpdatePosition({
      posX: clampedX,
      posY: clampedY,
      isOnGround: clampedY >= this.state.maxY
    });
  }

  attemptToUpdatePosition(newStateObj){
    for(let key in newStateObj){
      if(this.state[key] !== newStateObj[key]){
        this.setState(newStateObj);
        return;
      }
    }
  }

  //- recalc pet position when window changes size, when pets change, etc
  recalcMaxBounds(resetPetPosition){
    const spriteInfo = this.props.animation && this.props.animation.spriteInfo || null;
    if(spriteInfo){
      const spriteScale = spriteInfo.scale * global.spriteScale;
      const spriteSize = spriteInfo.cells.map(s => s * spriteScale);

      const stateObj = {
        maxX: (this.props.containerWidth - spriteSize[0]),
        maxY: (this.props.containerHeight - spriteSize[1] + this.props.floorOffset)
      }
      if(resetPetPosition){
        stateObj.posX = stateObj.maxX / 2
      }
      
      this.setState(stateObj);
    }
  }

  resetPetPosition(){
    window.setTimeout(() => {
      this.recalcMaxBounds(true)
    },0);
  }

  componentDidUpdate(prevProps, prevState){
    global.activePet = this;
    if(prevProps.activePetId !== this.props.activePetId){
      this.resetPetPosition();
    }
    if(prevProps.containerWidth !== this.props.containerWidth || prevProps.containerHeight !== this.props.containerHeight){
      this.recalcMaxBounds();
    }
  }

  render(){
    // console.log('R: Pet');
    // console.log('behavior:', this.props.behavior);
    const { animation, containerWidth, containerHeight } = this.props;
    //- some error happened
    if(!animation) return null;

    let drawCommand = null;
    if(animation.type){
      if(animation.spriteInfo.faceDirection){
        drawCommand = this.getDrawCommand(animation.type, [ containerWidth, containerHeight], [ this.state.posX, this.state.posY ], this.state.direction * (animation.spriteInfo.orientation || 1));
      }else{
        drawCommand = this.getDrawCommand(animation.type, [ containerWidth, containerHeight], [ this.state.posX, this.state.posY ], animation.spriteInfo.orientation || 1);
      }
    }

    return (
      <$PetContainer>
        <AnimationCanvas containerWidth={containerWidth} containerHeight={containerHeight} animation={animation} drawCommand={drawCommand} />
      </$PetContainer>
    );
  }
}


const mapStateToProps = (state) => ({
  behavior: selectCurrentPetBehavior(state),
  activity: selectActivePetActivity(state),
  animation: selectActivePetAnimation(state),
  floorOffset: selectActiveSceneFloorOffset(state)
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
