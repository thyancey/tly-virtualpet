import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimationCanvas from '../animation-canvas/';
import { getAnimation } from '../animation-canvas/_animations';

import { themeGet } from 'themes/';

import { clamp, randBetween } from 'util/tools';

import {
  addActivity,
  removeActivity,
  clickPet
} from '../../store/actions/pet';
import { 
  selectActivePetId,
  selectActivePetActivities,
  selectActivePetAnimation,
  selectCurrentPetBehavior,
  selectActiveCage,
  selectActiveSceneType
} from '../../store/selectors';

const ENABLE_DEBUG_CLICKS = false;
const MAX_DEBUG_CLICKS = 10;
const DRAG_Y = .97;
const DRAG_X = .7;
const FALL_Y = .5;
const JUMP_FORCE = .8;

const fps = 60;
let fpsInterval;
let then;
let now;
let elapsed;
let startTime;
let frameRatio;

let lastRoamCheck;
let nextRoamCheck;
let roamCheckRange = [ 200, 2000 ];
let thinkCheckRange = [ 200, 2000 ];
let maxPetSpeed = 2;
let hopChance = .2;

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
    this.thinkTimer = null;
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.vX = 0;
    this.vY = 0;
    this.aY = 1.08;
    this.frames = 0;

    // this.frames = 0;
    this.rAF = 0;
    this.updateAnimationState = this.updateAnimationState.bind(this);


    this.keysDown = [];

    this.state = {
      tick: 0,
      petSize: [0, 0],
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
      direction: 1,
      debugDraws: []
    }
    global.document.addEventListener('keyup', this.onKeyUp);
    global.document.addEventListener('keydown', this.onKeyDown);
  }

  componentDidMount() {    
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then
    this.rAF = requestAnimationFrame(this.updateAnimationState);
    this.resetPetPosition();
  }

  updateAnimationState() {
    now = Date.now();
    elapsed = now - then;
    frameRatio = elapsed / fpsInterval;

    if (frameRatio > 1) {
      then = now - (elapsed % fpsInterval);
      this.frames++;
      this.setState(prevState => ({ 
        tick: this.frames 
      }));
    }
    this.affectPetGravity(frameRatio);
    const activeInput = this.checkKeys(frameRatio);
    if(!activeInput) this.checkPetCommands(frameRatio);

    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  jumpPet(amount = 0){
    if(this.state.isOnGround){
      
      this.vY -= amount * JUMP_FORCE;
    }else{
      this.props.addActivity('JUMPING');
    }
  }

  startRoaming(){
    lastRoamCheck = Date.now();
    nextRoamCheck = lastRoamCheck + randBetween(roamCheckRange);
    this.props.addActivity('ROAMING');
  }

  stopRoaming(forced){
    this.props.removeActivity('ROAMING');
    if(forced){
      this.killTimer(this.thinkTimer);
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

  movePet(dX, dY, frameRatio){
    this.vY += (dY * frameRatio);
    this.vX += (dX * frameRatio);

    if(dX < 0){
      this.setState({
        direction: -1
      });
    }else if(dX > 0){
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

  startWalking(userInput){
    this.props.addActivity('WALKING');

    //- TODO, use debounce, but none of the npm modules worked for some reason
    this.startIdleTimer();
  }

  startIdleTimer(){
    this.killTimer(this.idleTimer);
    this.idleTimer = global.setTimeout(() => {
      this.stopWalking();
      this.stopDucking();
    }, 200)
  }

  startThinking(){
    this.startThinkTimer(randBetween(thinkCheckRange));
  }

  startThinkTimer(thinkTime){
    this.killTimer(this.thinkTimer);
    this.thinkTimer = global.setTimeout(() => {
      if(Math.random() < hopChance){
        this.jumpPet(20);
      }
      this.startRoaming();
      // this.stopWalking()
      // this.stopDucking()
    }, thinkTime)
  }

  killTimer(timerRef){
    if(timerRef){
      global.clearTimeout(timerRef);
      timerRef = null;
    }
  }

  hasActivity(activityKey){
    return this.props.activities.indexOf(activityKey) > -1
  }
  
  checkPetCommands(frameRatio){
    if(this.hasActivity('ROAMING')){
      if(Date.now() > nextRoamCheck){

        this.props.removeActivity('ROAMING');
        this.startThinking();
      }else{
        if(this.state.direction === -1){
          if(this.vX === 0){
            this.movePet(1, 0, frameRatio);
          }else{
            this.movePet(-1, 0, frameRatio);
          }
        }else{
          if(this.vX === 0){
            this.movePet(-1, 0, frameRatio);
          }else{
            this.movePet(1, 0, frameRatio);
          }
        }
      }
      // startRoaming(){
      //   lastRoamCheck = Date.now();
      //   nextRoamCheck = lastRoamCheck + ROAM_CHECK;
    }
  }

  checkKeys(frameRatio){
    if(this.props.behavior === 'DEAD'){
      return false;
    }
    this.keysDown.forEach(k => {
      switch(k){
        case 'ArrowRight': 
          this.movePet(1, 0, frameRatio);
          return true;
        case 'ArrowLeft':
          this.movePet(-1, 0, frameRatio);
          return true;
        case 'ArrowUp':
          this.jumpPet(20);
          return true;
        case 'ArrowDown':
          this.startDucking();
          return true;
        case 'KeyR':
          if(!this.hasActivity('ROAMING')){
            this.startRoaming();
          }
          return true;
        case 'KeyF':
          this.stopRoaming(true);
          return true;
        default: return false;
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

  affectPetGravity(timePerc){
    /* gravity stuff */
    this.vY = this.vY + FALL_Y;

    if(this.vY > 0 && this.vY < .25){
      this.vY = 0;
    }else{
      this.vY *= DRAG_Y;
    }

    if(this.vX > -1 && this.vX < 1){
      this.vX = 0;
    }else{
      this.vX = clamp((this.vX * DRAG_X), -maxPetSpeed, maxPetSpeed);
      // this.vX *= DRAG_X;
    }


    //- check for sitting on ground, staying in container
    const newY = this.state.posY + this.vY * timePerc;
    if(newY >= this.state.maxY){
      this.vY = 0;
    }

    const newX = this.state.posX + this.vX * timePerc;
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

      const petSize = [
        spriteSize[0] + spriteInfo.hitboxOffset[0],
        spriteSize[1] + spriteInfo.hitboxOffset[1]
      ]

      const stateObj = {
        petSize: petSize,
        minX: 0 - spriteInfo.hitboxOffset[0],
        minY: 0 - spriteInfo.hitboxOffset[1],
        maxX: (thisWidth - petSize[0]),
        maxY: (thisHeight - petSize[1] + this.props.activeCage.floor),
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
      this.setState({ debugDraws: [] })
    }
    if(prevProps.containerWidth !== this.props.containerWidth || prevProps.containerHeight !== this.props.containerHeight){
      this.recalcMaxBounds();
    }
    if(!prevState.isOnGround && this.state.isOnGround){
      this.props.removeActivity('JUMPING');
    }
  }

  checkForPetClicked(x, y){
    const petBox = [
      [ this.state.posX, this.state.posY ],
      [ this.state.posX + this.state.petSize[0], this.state.posY + this.state.petSize[1]]
    ];

    if(x > petBox[0][0] && x < petBox[1][0] && y > petBox[0][1] && y < petBox[1][1]){
      this.props.clickPet(this.props.petId);
    }
  }

  onStageClick(e){
    if(ENABLE_DEBUG_CLICKS){
      console.log('CLICK at ', [ e.clientX, e.clientY ]);
      const debugDraws = this.state.debugDraws;
      debugDraws.push([ e.clientX, e.clientY] );
      if(debugDraws.length > MAX_DEBUG_CLICKS){
        debugDraws.splice(0, debugDraws.length - MAX_DEBUG_CLICKS);
      }
      this.setState({debugDraws: debugDraws});
    }

    if(this.props.activeSceneType === 'responsive'){
      this.checkForPetClicked(e.clientX, e.clientY);
    }
  }

  render(){
    const { animation, petId } = this.props;
    //- some error happened

    if(!animation ) return null;

    let width = this.state.adjustedWidth;
    let height = this.state.adjustedHeight;

    let drawCommands = [];
    if(animation.type){
      if(animation.spriteInfo.faceDirection){
        drawCommands.push(this.getDrawCommand(animation.type, [ width, height], [ this.state.posX, this.state.posY ], this.state.direction * (animation.spriteInfo.orientation || 1)));
      }else{
        drawCommands.push(this.getDrawCommand(animation.type, [ width, height], [ this.state.posX, this.state.posY ], animation.spriteInfo.orientation || 1));
      }
    }

    this.state.debugDraws.forEach(dD => {
      drawCommands.push(this.getDrawCommand('DebugDraw', [ width, height], [ dD[0], dD[1] ]));
    })

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
            tick={this.state.tick} 
            petId={petId} 
            containerWidth={width} 
            containerHeight={height} 
            animation={animation} 
            drawCommands={drawCommands} 
            onStageClick={e => this.onStageClick(e)}
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
    { addActivity, removeActivity, clickPet },
    dispatch
  )
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pet);
