import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { 
  createGame, 
  updateBounds, 
  updatePet, 
  updateScene,
  updatePetAnimationLabel,
  updatePetActivities
} from './game';
import { debounce } from 'throttle-debounce';
import { 
  selectActivePet,
  selectActivePetId,
  selectActivePetAnimationLabel,
  selectActivePetActivities,
  selectActivePetActivitesString,
  selectActiveScene
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
    updateScene(this.props.activeScene);

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

    if(prevProps.activitiesString !== this.props.activitiesString){
      updatePetActivities(this.props.petId, this.props.activities)
    }

    if(prevProps.animationLabel !== this.props.animationLabel){
      updatePetAnimationLabel(this.props.petId, this.props.animationLabel);
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
  animationLabel: selectActivePetAnimationLabel(state),
  activities: selectActivePetActivities(state),
  activitiesString: selectActivePetActivitesString(state),
  activeScene: selectActiveScene(state)
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

