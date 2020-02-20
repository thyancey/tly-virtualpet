import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import Pet from '../../components/pet';
import PetStats from './pet-stats';

import { 
  selectActivePet,
  selectActivePetStats
} from '../../store/selectors';

import { getDeltaStats } from 'util/pet-store';


import {
  incrementXp,
  augmentStat,
  setMood,
  setActivity
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

const STAT_PING_RATE = 500;

class Cage extends Component {
  constructor(props){
    super(props);

    this.containerRef = React.createRef();
    this.onResize = this.onResize.bind(this);
    this.statPinger = null;

    this.state = {
      containerWidth: 500,
      containerHeight: 500,
      pingIdx: 0
    }
  }

  startStatPinger(){
    this.killStatPinger();

    this.statPinger = global.setInterval(() => {
      this.setState({
        pingIdx: this.state.pingIdx + 1
      });
    }, STAT_PING_RATE);
  }

  killStatPinger(){
    if(this.statPinger){
      global.clearTimeout(this.statPinger);
      this.statPinger = null;
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
    this.startStatPinger();
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

  getDeltaStatsArray(activePet){
    if(!activePet || !activePet.id) return [];

    const deltaStats = getDeltaStats(activePet.id, new Date().getTime());
    
    return deltaStats.map(stat => ({
      id: stat.id,
      label: stat.label || stat.id,
      cur: stat.current,
      max: stat.max,
      percent: (stat.current / stat.max) * 100,
      fillType: 'fill'
    }));
  }

  render(){
    const { 
      activePet,
      activePetStats,
      incrementXp,
      augmentStat,
      setMood,
      setActivity
    } = this.props;

    const deltaStats = this.getDeltaStatsArray(activePet);

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
              petData={activePet.data} 
              activity={activePet.activity}
              mood={activePet.mood}
              statsObj={activePetStats}
              deltaStats={deltaStats}
              incrementXp={incrementXp}
              augmentStat={augmentStat}
              setMood={setMood}
              setActivity={setActivity} />
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
      augmentStat,
      setMood,
      setActivity 
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cage)

