import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { 
  createGame, 
  updateBounds, 
  alterPet,
  alterItems,
  updateScene,
  updatePetAnimationLabel,
  updatePetActivities,
  updatePetMortality
} from './game';
import { debounce } from 'throttle-debounce';
import { 
  selectActivePetGraphics,
  selectActivePetAnimationLabel,
  selectActivePetIsAlive,
  selectPhaserPet,
  selectActivePetActivities,
  selectActiveScene,
  selectActiveItems
} from '@store/selectors';

import {
  addActivity,
  setActivities,
  removeActivity,
  augmentStats
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
    this.debouncedUpdateBounds(0, 0, this.props.width, this.props.height);
    // changePet(this.props.activePet, this.props.activePetGraphics);
    alterItems(this.props.activeItems);
    alterPet(this.props.phaserPet);
    updateScene(this.props.activeScene);

    global.game.onInterface = (event, payload) => {
      switch(event){
        case 'addActivity': this.props.addActivity(payload);
          break;
        case 'removeActivity': this.props.removeActivity(payload);
          break;
        case 'augmentStats': this.props.augmentStats(payload);
          break;
        case 'sendStatus': this.onSendStatus(payload);
          break;
        default: console.error('invalid interface command', event);
      }
    }
  }

  onSendStatus(activities){
    this.props.setActivities(activities);
  }

  onEmitter(e){
    console.error('onEmitter', e)
  }

  componentDidUpdate(prevProps){
    if(prevProps.width !== this.props.width || prevProps.height !== this.props.height){
      this.debouncedUpdateBounds(0, 0, this.props.width, this.props.height);
    }

    if(prevProps.phaserPet !== this.props.phaserPet){
      // console.log('phaserPet', this.props.phaserPet);
      alterItems(global.itemStore.getItems());
      alterPet(this.props.phaserPet);
    }

    if(prevProps.activePetIsAlive !== this.props.activePetIsAlive){
      updatePetMortality(this.props.phaserPet.id, this.props.activePetIsAlive);
    }

    if(prevProps.activePetActivities !== this.props.activePetActivities){
      updatePetActivities(this.props.phaserPet.id, this.props.activePetActivities)
    }

    if(prevProps.animationLabel !== this.props.animationLabel){
      updatePetAnimationLabel(this.props.phaserPet.id, this.props.animationLabel);
    }

    if(prevProps.activeScene !== this.props.activeScene){
      updateScene(this.props.activeScene)
    }
  }

  render(){
    return(
      <S.PhaserContainer id={`phaser-container-${this.props.id}`} />
    );
  }
}

const mapStateToProps = (state) => ({
  phaserPet: selectPhaserPet(state),
  activePetGraphics: selectActivePetGraphics(state),
  activePetIsAlive: selectActivePetIsAlive(state),
  animationLabel: selectActivePetAnimationLabel(state),
  activePetActivities: selectActivePetActivities(state),
  activeScene: selectActiveScene(state),
  activeItems: selectActiveItems(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    { addActivity, removeActivity, setActivities, augmentStats },
    dispatch
  )
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhaserComponent);

