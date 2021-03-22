import React, { Component } from 'react';
import styled from 'styled-components';
import { getColor } from '@themes/';
import { LilButton } from '@components/ui/button';

const S = {};
S.Wrapper = styled.div`
  position:relative;

  &:hover{
    .statEventDetail{
      opacity:1;
    }
  }
`


S.CooldownBar = styled.div`
  width:100%;
  background-color: ${getColor('grey')};
  height:5px;

  >div{
    background-color: ${getColor('blue')};
    height:100%;
    transition: width .1s linear;
  }
`

class StatEventButton extends Component {
  constructor(props){
    super(props);

    this.cooldownTimer = null;

    this.state = {
      isCooling: false,
      coolAt: null
    }
  }

  coolDownComplete(){
    this.setState({
      isCooling:false,
      coolAt:null
    });
  }

  startCooldown(cooldown){
    this.setState({
      isCooling: true,
      coolAt: new Date().getTime() + cooldown
    });
    this.startCooldownTimer(cooldown);
  }

  startCooldownTimer(cooldown){
    this.killCooldownTimer();
    this.cooldownTimer = global.setTimeout(() => {
      this.coolDownComplete();
    }, cooldown)
  }

  killCooldownTimer(){
    if(this.cooldownTimer){
      global.clearTimeout(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }


  onButtonClick(statEventObj){
    // console.log(statEventObj);
    // console.log('affecting stats: ', statEventObj.statEffects);
    // console.log('with cooldown', statEventObj.cooldown);

    if(this.state.isCooling){
      //- if button uses the real disabled, this wont happen
      console.error('ITEM IS STILL COOLING');
    }else{
      if(statEventObj.cooldown){
        this.startCooldown(statEventObj.cooldown);
      }
      this.triggerStatEffects(statEventObj.statEffects);
    }
  }

  triggerStatEffects(statEffects){
    statEffects.forEach(sE => {
      if(sE.immediate){
        this.props.onImmediateUpdate(sE.id, sE.immediate);
      }
    })
  }

  renderTooltip(statEventObj){

    let retString ='';
    statEventObj.statEffects.forEach((sE,idx) => {
      if(idx > 0) retString += '\n';
      retString += `${sE.id}:`;
      if(sE.immediate){
        retString += sE.immediate > 0 ? `+${sE.immediate}` : `${sE.immediate}`;
      }
    });

    if(statEventObj.cooldown){
      retString += `\ncooldown: ${statEventObj.cooldown}`;
    }

    return retString;
  }

  getCooldownWidth(cooldown){
    if(cooldown){
      if(!this.state.isCooling) return '100%';
      const percDone = (this.state.coolAt - new Date().getTime()) / cooldown;
      return Math.round(percDone * 100) + '%'
    }else{
      return null;
    }
  }

  render(){
    const { statEventObj } = this.props;
    const cooldownWidth = this.getCooldownWidth(statEventObj.cooldown);

    return (
      <S.Wrapper >
        <LilButton 
          text={statEventObj.label} 
          onClick={e => this.onButtonClick(statEventObj)} 
          isDisabled={this.state.isCooling}
          tooltip={this.renderTooltip(statEventObj)}>
        </LilButton>
        {cooldownWidth && (
          <S.CooldownBar>
            <div style={{width: cooldownWidth }} />
          </S.CooldownBar>
        )}
      </S.Wrapper>
    );
  }
}

export default StatEventButton;
