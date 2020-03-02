import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { themeGet, getColor, mixin_clearBubble } from 'themes/';

import ProgressBar from './components/progress-bar';

import { LilButton, Button } from 'components/button';


import {
  ping
} from 'store/actions/index';
import {
  augmentStat,
  setMood,
  setActivity,
  resetPet,
  killPet
} from 'store/actions/pet';
import { 
  selectActivePet,
  selectActiveDeltaStats,
  selectActiveSceneStyles
} from 'store/selectors';


const $PetStats = styled.div`
  padding: 1rem;
  position:relative;
  ${mixin_clearBubble()}
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
  right:0;
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

const $InfoButton = styled.div`
  position:absolute;
  right: .5rem;
  bottom: .5rem;
  z-index:1;
`

const $Info = styled.div`
  ${mixin_clearBubble()}
  max-height:500px;
  transition: max-height .5s ease-in-out;
  overflow: hidden;
  opacity:1;
  color: ${p => getColor('black')};

  padding: 1rem;
  margin: .5rem;
  font-weight: bold;

  ${p => !p.showInfo && css`
    max-height:0;
    opacity:0;
    transition: max-height .5s ease-in-out, opacity .2s;
  `}
`

const StatDisplay = ({ statObj }) => {
  return (
    <$StatDisplay>
      <$StatDisplayLabel>{statObj.label}</$StatDisplayLabel>
      <$StatDisplayValue>{statObj.cur}</$StatDisplayValue>
    </$StatDisplay>
  );
};

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

  getDeadStats(deltaStats){
    return deltaStats.filter(ds => {
      if(ds.doesKill){
        // console.log(`${ds.id}, fullIsGood:${ds.fullIsGood}, cur:${ds.cur}, max:${ds.max}`)
        if(ds.fullIsGood && ds.cur === 0){
          return true;
        }else if(!ds.fullIsGood && ds.cur === ds.max){
          return true;
        }
      }

      return false;
    });
  }

  checkForDead(deltaStats){
    if(this.getDeadStats(deltaStats).length > 0){
      this.props.killPet(this.props.activePet.id)
    }
  }

  render(){
    // console.log('R: Info');
    const { 
      setMood,
      setActivity,
      activePet,
      deltaStats,
      sceneStyles
    } = this.props;
    if(!activePet) return null;

    const petData = activePet.data;
    const activity = activePet.activity;
    const mood = activePet.mood;
    // console.log('activities', petData.activities);
    const activityIds = Object.keys(petData.activities);

    const level = deltaStats.find(ds => ds.id === 'level') ? deltaStats.find(ds => ds.id === 'level').cur : -1;

    const isAlive = activePet.isAlive;
    if(isAlive) this.checkForDead(deltaStats);

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
              <ProgressBar key={i} sceneStyles={sceneStyles} statObj={s} label={s.label} augmentAction={(id, val) => this.updateStat(id, val)}/>
            );
          }
        })}
        
        <$InfoButton>
          <LilButton text={'info'} onClick={e => this.onToggleShowInfo()} />
        </$InfoButton>
        <$Info showInfo={this.state.isInfoOpen}>
          <p>{'Mood'}</p>
          <LilButton isActive={mood === 'HAPPY'} text={'HAPPY'} onClick={e => setMood && setMood('HAPPY')} />
          <LilButton isActive={mood === 'SAD'} text={'SAD'} onClick={e => setMood && setMood('SAD')} />
          <LilButton isActive={mood === 'DEAD'} text={'DEAD'} onClick={e => setMood && setMood('DEAD')} />
          <hr/>
          <p>{'Activity'}</p>
          {activityIds.map((aId, idx) => (
            <LilButton key={idx} isActive={activity === aId} text={aId} onClick={() => setActivity(aId)} />
          ))}
          <hr/>

          <div>
            <Button text={'RESET PET'} onClick={() => this.resetPet(activePet.id)} style={{backgroundColor: getColor('red')}} />
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
  deltaStats: selectActiveDeltaStats(state),
  sceneStyles: selectActiveSceneStyles(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      augmentStat,
      setMood,
      setActivity,
      resetPet,
      ping,
      killPet
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetStats)

