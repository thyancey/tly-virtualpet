import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { 
  createGame, 
  updateBounds, 
  updatePet, 
  updatePetAnimationLabel,
  updatePetActivities
} from './game';
import { debounce } from 'throttle-debounce';
import { 
  selectActivePet,
  selectActivePetId,
  selectActivePetAnimation,
  selectActivePetActivities,
} from '@store/selectors';

import {
  addActivity,
  setActivities,
  removeActivity
} from '@store/actions/pet';

const S = {};
S.PhaserContainer = styled.div`
  display:block;
`;

class PhaserComponent extends Component {
  componentDidMount(){
    createGame({
      id: `phaser-container-${this.props.id}`
    });

    this.debouncedUpdateBounds = debounce(500, false, updateBounds);
    updatePet(this.props.pet);

    // global.emitter = EventDispatcher.getInstance();
    // window.setTimeout(() => {
    //   global.emmiter.on('SOMETHING', this.onEmitter);

    // }, 6000)

    // global.addEventListener('phaser.interface', function (e, d) {
    //   console.log('addActivity', e, d)
    // });

    console.log('game is ', global.game)
  
    global.game.onInterface = (event, payload) => {
      switch(event){
        case 'addActivity': this.props.addActivity(payload);
          break;
        case 'removeActivity': this.props.removeActivity(payload);
          break;
        case 'sendStatus': this.onSendStatus(payload);
          break;
        default: console.error('invalid interface command', event);
      }
    }
  }

  onSendStatus(data){
    this.props.setActivities(data);
    // console.log('onSendStatus', data)
  }

  onEmitter(e){
    console.error('onEmitter', e)
  }

  componentDidUpdate(prevProps){
    if(prevProps.width !== this.props.width || prevProps.height !== this.props.height){
      this.debouncedUpdateBounds(0, 0, this.props.width, this.props.height);
    }

    if(prevProps.petId !== this.props.petId){
      updatePet(this.props.pet);
    }

    if(prevProps.animation !== this.props.animation){
      updatePetActivities(this.props.petId, this.props.activities)
      updatePetAnimationLabel(this.props.petId, this.props.animation.label);
    }
  }

  render(){
    return(
      <S.PhaserContainer id={`phaser-container-${this.props.id}`} />
    );
  }
}

const mapStateToProps = (state) => ({
  petId: selectActivePetId(state),
  pet: selectActivePet(state),
  animation: selectActivePetAnimation(state),
  activities: selectActivePetActivities(state),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    { addActivity, removeActivity, setActivities },
    dispatch
  )
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhaserComponent);

