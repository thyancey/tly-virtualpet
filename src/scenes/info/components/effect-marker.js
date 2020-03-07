import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { themeGet, shadeColor, getColor } from 'themes/';
import { round, parseExpressionString } from 'util/tools';

import { send, sendQuiet } from 'util/logger';

const $EffectMarker = styled.div`
  box-shadow: ${themeGet('shadow', 'z3')};
  position:absolute;
  height:100%;
  z-index:1;
  opacity: .5;

  transition: opacity 1s;

  ${p => p.isActive && css`
    opacity: 1;
    transition: opacity 1s;
  `}

  /* &:nth-child(odd){
    .effect-label{
      bottom:100%;
      border-radius: 1rem 1rem 0 0;
      border-bottom: 0;
    }
  }
  &:nth-child(even){ */
    .effect-label{
      top:100%;
      border-radius: 0 0 1rem 1rem;
      border-top: 0;
    }
  /* } */

`

const $Stick = styled.div`
  width:8px;
  height:100%;
  opacity:1;
  margin-left:-4px;

  >*{
    display:inline-block;
    width:4px;
    height:100%;
  }

  ${p => p.direction === 1 && css`
    >.left{
      background-color: ${getColor('white')};
    }
    >.right{
      background-color: ${p => p.color};
    }
  `}
  ${p => p.direction === -1 && css`
    >.left{
      background-color: ${p => p.color};
    }
    >.right{
      background-color:  ${getColor('white')};
    }
  `}
`


const $Bubble = styled.div`
  box-shadow: ${themeGet('shadow', 'z3')};
  border: .3rem solid ${p => p.color};
  background-color: ${p => p.color};
  position:absolute;

  white-space: nowrap;
  font-size: 1rem;


  width:3rem;
  height:2rem;

  overflow:hidden;

  >*{
    position:absolute;
    left:0;
    top:0;
    width:50%;
    height:100%;

    &.left{
    }

    &.right{
      left:calc(50%);
    }
  }

  transform:translateX(-50%);

  ${p => p.direction === 1 && css`
    >.left{
      background-color: ${getColor('white')};
    }
    >.right{
      background-color: ${p => p.color};
    }
  `}
  ${p => p.direction === -1 && css`

    >.left{
      background-color: ${p => p.color};
    }
    >.right{
      background-color: ${getColor('white')};
    }
  `}
  ${p => p.direction === 0 && css`
    background-color: ${getColor('white')};
  `}
`

const $BubbleTip = styled.div`

  ${p => p.isShowing ? css`
    top:100%;
    opacity: 1;
  `:css`
    top:0%;
    opacity: 0;
  `}

  pointer-events: none;
  position:absolute;
  background-color: ${p => p.color};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: ${themeGet('shadow', 'z3')};
  font-size:1.25rem;
  left:50%;
  transform:translateX(-50%);

  margin-top:3rem;

  min-width: 15rem;

  transition: opacity .3s, top .2s;
`


/*
{
  id
  label
  cur
  max
  percent
  fullIsGood
  doesKill
  fillType
  effects:[
    {
      when: "<=_30%"
      then "MOOD_TINY"
    }
  ]
}
*/
const parseEffect = (effect, statObj) => {
  const expressionObj = parseExpressionString(effect.when);
  // console.log('criteria', expressionObj.criteria, expressionObj.isPercent);
  // sendQuiet(effect, statObj, expressionObj, true);


  let percentVal;
  if(expressionObj.isPercent){
    percentVal = expressionObj.criteria;
  }else{
    percentVal = round(expressionObj.criteria / statObj.max, 2) * 100;
  }

  return {
    label: effect.mood.label,
    position: `${percentVal}%`,
    direction: expressionObj.direction
  }
}

class EffectMarker extends Component {
  constructor(props){
    super(props);

    this.state = {
      tooltipShowing: false
    }
  }

  onEnterBubble(e){
    this.setState({
      tooltipShowing: true
    });
  }

  onLeaveBubble(){
    this.setState({
      tooltipShowing: false
    });
  }

  renderMessage(effect, statLabel, doesKill, fullIsGood, direction){
    const retMessages = []
    retMessages.push(<span key="1">{`when: ${effect.when}, I feel a little `}<strong>{`${effect.mood.label}`}</strong></span>);

    if(doesKill){
      if(fullIsGood && direction === -1){
        retMessages.push(<span key="2">{`if i dont have enough `}<strong>{statLabel}</strong>{` i'll die!`}</span>);
      }else if(!fullIsGood && direction === 1){
        retMessages.push(<span key="2">{`if i have too much `}<strong>{statLabel}</strong>{` i'll die!`}</span>);
      }
    }

    return retMessages;
  }

  render(){
    const { effect, statObj, colorObj, isActive } = {...this.props};

    const effectMarker = parseEffect(effect, statObj);
  
    let color = getColor('white');
    const direction = effectMarker.direction;
    if(direction === 1){
      color = colorObj.plus;
    }else if(direction === -1){
      color = colorObj.minus;
    }

    return (
      <$EffectMarker style={{ left: effectMarker.position }} isActive={isActive} onMouseEnter={(e) => this.onEnterBubble(e)} onMouseLeave={() => this.onLeaveBubble()}>
        <$Stick color={color} isActive={isActive} direction={direction}>
          <div className="left"></div>
          <div className="right"></div>
        </$Stick>
        <$Bubble className="effect-label" color={color} isActive={isActive} direction={direction} alt={effectMarker.label} >
          <div className="left"></div>
          <div className="right"></div>
        </$Bubble>

        <$BubbleTip color={color} isShowing={this.state.tooltipShowing} >
          {this.renderMessage(effect, statObj.label, statObj.doesKill, statObj.fullIsGood, direction)}
        </$BubbleTip>
      </$EffectMarker>
    );
  }

}

export default EffectMarker;
