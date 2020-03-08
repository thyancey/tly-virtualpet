import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimationCanvas from '../animation-canvas/';
import { getAnimation } from '../animation-canvas/_animations';

import { themeGet } from 'themes/';

import { clamp } from 'util/tools';

import {
  addActivity,
  removeActivity
} from '../../store/actions/pet';
import { 
  selectActivePetId,
  selectActivePetActivities,
  selectActivePetAnimation,
  selectCurrentPetBehavior,
  selectActiveCage,
  selectActiveSceneType
} from '../../store/selectors';


const FRAME_RATE = 1;
const DRAG_Y = .99;
const DRAG_X = .8;
const FALL_Y = 1;


const $PetContainer = styled.div`
  position:absolute;
  width:0;
  height:0;
`;

const $Centerer = styled.div`
  left:50%;
  top:50%;
  transform:translate(-50%, -50%);
`

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
      cssX: '0px',
      cssY: '0px',
      adjustedWidth: 0,
      adjustedHeight: 0,
      adjustedRotation: 0,
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
    }else{
      this.props.addActivity('JUMPING');
    }
  }

  
  startDucking(){
    this.props.addActivity('DUCKING');

    //- TODO, use debounce, but none of the npm modules worked for some reason
    this.startIdleTimer();
  }
  stopDucking(){
    if(this.props.activities.indexOf('DUCKING') > -1){
      this.props.removeActivity('DUCKING');
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
    if(this.props.activities.indexOf('WALKING') > -1){
      this.props.removeActivity('WALKING');
    }
  }

  startWalking(){
    this.props.addActivity('WALKING');

    //- TODO, use debounce, but none of the npm modules worked for some reason
    this.startIdleTimer();
  }

  startIdleTimer(){
    this.killIdleTimer();
    this.idleTimer = global.setTimeout(() => {
      this.stopWalking()
      this.stopDucking()
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
          this.startDucking();
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
    const cageObj = this.props.activeCage;
    const sceneType = this.props.activeSceneType;

    if(spriteInfo && cageObj){
      const spriteScale = spriteInfo.scale * global.spriteScale;
      const spriteSize = spriteInfo.cells.map(s => s * spriteScale);


      // const containerWidth = cageObj.width;
      // const containerHeight = cageObj.height;
      const containerWidth = this.props.containerWidth;
      const containerHeight = this.props.containerHeight;

      let adjustedWidth;
      let adjustedHeight;
      
      if(isNaN(cageObj.width) && cageObj.width.indexOf('%') > -1){
        adjustedWidth = (Number(cageObj.width.split('%')[0]) / 100) * containerWidth;
      }else{
        adjustedWidth =  cageObj.width;
      }

      if(isNaN(cageObj.height) && cageObj.height.indexOf('%') > -1){
        adjustedHeight = (Number(cageObj.height.split('%')[0]) / 100) * containerHeight;
      }else{
        adjustedHeight =  cageObj.height;
      }
      
      let cssX;
      let cssY;
      if(sceneType === 'responsive'){
        let adjustedX = cageObj.x + (adjustedWidth / 2);
        let adjustedY = cageObj.y + (adjustedHeight / 2);

        cssX = `${adjustedX}px`;
        cssY = `${adjustedY}px`;
      }else if(sceneType === 'static'){
        cssX = `calc(50% + ${cageObj.xCenter}px)`;
        cssY = `calc(50% + ${cageObj.yCenter}px)`;
      }else{
        cssX = `${cageObj.x}px`;
        cssY = `${cageObj.y}px`;
      }

      let thisWidth = sceneType === 'responsive' ? containerWidth : cageObj.width;
      let thisHeight = sceneType === 'responsive' ? containerHeight : cageObj.height;

      const stateObj = {
        minX: 0 - spriteInfo.hitboxOffset[0],
        minY: 0 - spriteInfo.hitboxOffset[1],
        maxX: (thisWidth - spriteSize[0] + spriteInfo.hitboxOffset[0]),
        maxY: (thisHeight - spriteSize[1] + this.props.activeCage.floor + spriteInfo.hitboxOffset[1]),
        cssX: cssX,
        cssY: cssY,
        adjustedWidth: adjustedWidth,
        adjustedHeight: adjustedHeight,
        adjustedRotation: this.props.activeCage.rotation
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
    // console.log('update', prevState, this.state);
    // global.activePet = this;
    if(prevProps.activePetId !== this.props.activePetId){
      this.resetPetPosition();
    }
    if(prevProps.containerWidth !== this.props.containerWidth || prevProps.containerHeight !== this.props.containerHeight){
      this.recalcMaxBounds();
    }
    if(!prevState.isOnGround && this.state.isOnGround){
      this.props.removeActivity('JUMPING');
    }
  }

  render(){
    const { animation, petId } = this.props;
    //- some error happened

    if(!animation ) return null;

    let width = this.state.adjustedWidth;
    let height = this.state.adjustedHeight;

    let drawCommand = null;
    if(animation.type){
      if(animation.spriteInfo.faceDirection){
        drawCommand = this.getDrawCommand(animation.type, [ width, height], [ this.state.posX, this.state.posY ], this.state.direction * (animation.spriteInfo.orientation || 1));
      }else{
        drawCommand = this.getDrawCommand(animation.type, [ width, height], [ this.state.posX, this.state.posY ], animation.spriteInfo.orientation || 1);
      }
    }

    return (
      <$PetContainer style={{
        left: `${this.state.cssX}`, 
        top: `${this.state.cssY}`, 
        transform: `rotate(${this.state.adjustedRotation}deg)`
      }} >
        <$Centerer style={{
          width: width, 
          height: height
        }} >
          <AnimationCanvas 
            petId={petId} 
            containerWidth={width} 
            containerHeight={height} 
            animation={animation} 
            drawCommand={drawCommand} 
          />
        </$Centerer>
      </$PetContainer>
    );
  }
}


const mapStateToProps = (state) => ({
  petId: selectActivePetId(state),
  behavior: selectCurrentPetBehavior(state),
  activities: selectActivePetActivities(state),
  animation: selectActivePetAnimation(state),
  activeCage: selectActiveCage(state),
  activeSceneType: selectActiveSceneType(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    { addActivity, removeActivity },
    dispatch
  )
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pet);
