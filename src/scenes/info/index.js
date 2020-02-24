import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { themeGet } from 'themes/';

import ProgressBar from './components/progress-bar';

import { LilButton } from '../../components/button';
import { Button } from 'components/button';


import {
  ping
} from 'store/actions/index';
import {
  augmentStat,
  setMood,
  setActivity,
  resetPet
} from 'store/actions/pet';
import { 
  selectActivePet,
  selectActiveDeltaStats
} from 'store/selectors';


const $PetStats = styled.div`
  padding: 1rem;
`

const $StatDisplay = styled.div`
  text-align:right;
`

const $StatDisplayLabel = styled.span`
  color: ${themeGet('color', 'white')};
  font-size:2rem;
`
const $StatDisplayValue = styled.span`
  color: ${themeGet('color', 'green')};
  margin-left:1rem;
  font-size:3rem;
`

const $NameContainer = styled.div`
  position:fixed;
  bottom:0;
  width:100%;
`;

const $Name = styled.div`
  position:absolute;
  right:2rem;
  padding: 1rem 2rem;
  padding-right:4rem;
  bottom:1rem;
  border: 4px solid black;
  
  border-radius:2rem;
  background-color:white;
  color:black;
  text-align:center;
`

const $Level = styled.div`
  border-radius: 2rem;
  border: 4px solid black;
  padding: 1rem;
  position:absolute;
  right:-1rem;
  top:-50%;
  text-align:right;

  font-style: bold;


  color: ${themeGet('color', 'blue')};
  background-color: ${themeGet('color', 'white')};
`
const StatDisplay = ({ statObj }) => {
  return (
    <$StatDisplay>
      <$StatDisplayLabel>{statObj.label}</$StatDisplayLabel>
      <$StatDisplayValue>{statObj.cur}</$StatDisplayValue>
    </$StatDisplay>
  );
};


const $Info = styled.div`
  border: 2px solid white;
  background-color: ${themeGet('color', 'purple')};

  ${p => !p.showInfo && css`
    display:none;
  `}
`

class PetStats extends Component {
  constructor(props){
    super(props);

    this.state = {
      isInfoOpen: false
    }
  }

  onToggleShowInfo(force){
    this.setState({
      isInfoOpen: force !== undefined ? force : !this.state.isInfoOpen
    });
  }

  updateStat(id, val){
    this.props.augmentStat(id, val);
    this.props.ping();
  }

  resetPet(id){
    this.props.resetPet(id);
    this.props.ping();
  }

  render(){
    // console.log('R: Info');
    const { 
      setMood,
      setActivity,
      activePet,
      deltaStats
    } = this.props;
    if(!activePet) return null;

    const petData = activePet.data;
    const activity = activePet.activity;
    const mood = activePet.mood;

    const level = deltaStats.find(ds => ds.id === 'level') ? deltaStats.find(ds => ds.id === 'level').cur : -1;

    return (
      <$PetStats>
        {deltaStats.map((s, i) => {
          if(s.type === 'number'){
            return null;
            {/* return (
              <StatDisplay key={i} statObj={s} />
            ); */}
          }else{
            return (
              <ProgressBar key={i} statObj={s} label={s.label} augmentAction={(id, val) => this.updateStat(id, val)}/>
            );
          }
        })}
        
        <Button text={'info'} onClick={e => this.onToggleShowInfo()}/>
        <$Info showInfo={this.state.isInfoOpen}>
          <p>{`${petData.id}`}</p>
          <p>{'Mood'}</p>
          <LilButton isActive={mood === 'HAPPY'} text={'HAPPY'} onClick={e => setMood && setMood('HAPPY')} />
          <LilButton isActive={mood === 'SAD'} text={'SAD'} onClick={e => setMood && setMood('SAD')} />
          <p>{'Activity'}</p>
          <LilButton isActive={activity === 'IDLE'} text={'IDLE'} onClick={() => setActivity('IDLE')} />
          <LilButton isActive={activity === 'WALK'} text={'WALK'} onClick={() => setActivity('WALK')} />

          <div>
            <Button text={'RESET'} onClick={() => this.resetPet(activePet.id)} />
          </div>
        </$Info>
        
        <$NameContainer>
          <$Name>
            <span>{`${petData.name} the ${petData.animal}`}</span>
            <$Level><span>{level}</span></$Level>
          </$Name>
        </$NameContainer>
      </$PetStats>
    );
  }
}

const mapStateToProps = (state) => ({
  activePet: selectActivePet(state),
  deltaStats: selectActiveDeltaStats(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      augmentStat,
      setMood,
      setActivity,
      resetPet,
      ping
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetStats)
