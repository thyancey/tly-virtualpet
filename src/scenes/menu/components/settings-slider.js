import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet, getColor } from '@themes/';

import { setSettingsValue } from '@store/actions';

//- how often in milliseconds allowed to send action on dragging slider8
const SLIDER_THROTTLE = 100;

const S = {};
S.Wrapper = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  
  ${p => p.isDisabled && css`
    opacity:.2;
  `}
`;

S.Label = styled.div`
  margin-bottom: .5rem;
`;


S.RangeInput = styled.input`

  -webkit-appearance: none;
  width: 100%;
  height: 1rem;
  border-radius: .5rem;
  background: ${getColor('purple')};
  outline: none;
  cursor: pointer;
  ${p => p.isInverted && css`
    direction: rtl;
  `}

  &:disabled{
    opacity:.5;
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: ${getColor('blue')};
    box-shadow: ${themeGet('shadow', 'z1')};
    cursor: grab;
  }

  &::-moz-range-thumb {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: ${getColor('blue')};
    cursor: grab;
  }
`;


class SettingsSlider extends Component {
  constructor(props){
    super(props);

    this.throttleTimer = null;
  }

  killThrottleTimer(){
    if(this.throttleTimer){
      global.clearTimeout(this.throttleTimer);
      this.throttleTimer = null;
    }
  }

  startThrottleTimer(time, callback){
    if(this.throttleTimer) return;
    
    this.throttleTimer = global.setTimeout(() => {
      callback && callback();
      this.killThrottleTimer();
    }, time)
  }

  onChangeSlider(value){
    this.startThrottleTimer(SLIDER_THROTTLE, () => this.props.setSettingsValue({ id: this.props.id, value: value }));
  }

  render(){
    const {
      title,
      value,
      min,
      max,
      step,
      isInverted,
      isDisabled
    } = this.props;

    return(
      <S.Wrapper isDisabled={isDisabled}>
        <S.Label>              
          <span>{`${title}:`}</span>
          <span>{` ${value}`}</span>
        </S.Label>
        <S.RangeInput id="myRange" type="range" min={min} max={max} step={step} value={value} disabled={isDisabled} onChange={e => this.onChangeSlider(e.target.value)} isInverted={isInverted}/>
      </S.Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setSettingsValue },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsSlider)

