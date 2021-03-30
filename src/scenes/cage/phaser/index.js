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
    {},
    dispatch
  )
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhaserComponent);

