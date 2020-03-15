import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import { setSettingsValue } from 'store/actions';
import { 
  selectSettingPingRate,
  selectSettingVolume,
  selectSettingAnimationSpeed
} from 'store/selectors';

import SettingsSlider from './settings-slider';

const $Body = styled.div`
  ul{
    padding:0;
    margin: 0;
    list-style:none;

    text-align:left;
  }
`;

const $Item = styled.li`
  display: inline-block;
  width:100%;
  margin-bottom: 1rem;

  span:first-of-type{
    font-weight: bold;
  }

  span:last-of-type{

  }

  &:last-of-type{
    margin-bottom: 2rem;
  }
`

class PanelSettings extends Component {
  constructor(props){
    super(props);

    this.onPanelClick = this.onPanelClick.bind(this);

    this.state = {
      isOpen: false
    }
  }

  onPanelClick(e){
    this.setState({ isOpen: !this.state.isOpen });
  }


  render(){
    const { 
      pingRate,
      volume,
      animationSpeed
    } = this.props;

    const settingsData = [
      { 
        id: 'pingRate',
        title: 'Stat Update Speed',
        min: 50,
        max: 5000,
        step: 10, 
        isDisabled: false,
        isInverted: true,
        value: pingRate 
      },
      { 
        id: 'volume',
        title: 'Volume',
        min: 0,
        max: 100,
        step: 5, 
        isDisabled: true,
        isInverted: false,
        value: volume 
      },
      { 
        id: 'animationSpeed',
        title: 'Animation Speed',
        min: 5,
        max: 1000,
        step: 1, 
        isDisabled: true,
        isInverted: true,
        value: animationSpeed 
      }
    ]

    return(
      <$Body>
        <ul>
          { settingsData.map((c, i) => (
            <$Item key={i}>
              <SettingsSlider 
                id={c.id} 
                title={c.title} 
                value={c.value} 
                min={c.min} 
                max={c.max} 
                step={c.step} 
                isDisabled={c.isDisabled}
                isInverted={c.isInverted}
              />
            </$Item>
          ))}
        </ul>
      </$Body>
    );
  }
}

const mapStateToProps = (state) => ({
  pingRate: selectSettingPingRate(state),
  volume: selectSettingVolume(state),
  animationSpeed: selectSettingAnimationSpeed(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setSettingsValue },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelSettings)

