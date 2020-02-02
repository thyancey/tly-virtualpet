import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import Pet from 'components/pet';
import PetStats from 'components/pet/pet-stats';

import { 
  selectActivePet,
  selectActivePetStats
} from 'store/selectors';


import {
  incrementXp,
  incrementFood,
  incrementHappy,
  incrementPee
} from 'store/actions/pet';

const $Cage = styled.div`
  position:relative;

  width:100%;
  height:100%;

  background-color:  ${themeGet('color', 'black')};
  color: ${themeGet('color', 'blue')};
  border: .5rem dashed ${themeGet('color', 'blue')};

  border-radius: 2rem;
  /* padding: 2rem; */
  box-shadow: 0rem 0rem 2rem ${themeGet('color', 'blue')};

  h2{
    color: ${themeGet('color', 'white')};
  }
`
const $PetStatsContainer = styled.div`
  position:absolute;
  top:1rem;
  right:1rem;
`

class Cage extends Component {
  constructor(props){
    super(props);

    this.containerRef = React.createRef();
    this.onResize = this.onResize.bind(this);
    this.state = {
      containerWidth: 500,
      containerHeight: 500
    }
  }

  componentDidUpdate(prevProps){
    //- when the first canavs is rendered, check the page bounds
    if(!prevProps.activePet && this.props.activePet){
      this.onResize();
    }
  }

  componentDidMount() {
    global.addEventListener('resize', this.onResize);
  }

  onResize(){
    this.updateCanvasDims();
  }

  updateCanvasDims(){
    if(this.containerRef.current){
      this.setState({
        containerWidth: this.containerRef.current.offsetWidth,
        containerHeight: this.containerRef.current.offsetHeight
      })
    }
  }

  render(){
    const { 
      activePet,
      activePetStats,
      incrementXp,
      incrementFood,
      incrementHappy,
      incrementPee 
    } = this.props;

    if(!activePet){
      return null;
    }else{
      return(
        <$Cage ref={this.containerRef} >
          <Pet 
            petData={activePet} 
            level={activePetStats.level}
            containerWidth={this.state.containerWidth}
            containerHeight={this.state.containerHeight} />
          <$PetStatsContainer>
            <PetStats 
              petData={activePet} 
              statsObj={activePetStats}
              incrementXp={incrementXp}
              incrementFood={incrementFood}
              incrementHappy={incrementHappy}
              incrementPee={incrementPee} />
          </$PetStatsContainer>
        </$Cage>
      );
    }

  }
}

const mapStateToProps = (state) => ({
  activePet: selectActivePet(state),
  activePetStats: selectActivePetStats(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      incrementXp,
      incrementFood,
      incrementHappy,
      incrementPee 
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cage)

