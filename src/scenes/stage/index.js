import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import Cage from 'scenes/cage';

import { 
  getActivePetType,
  getActivePetId,
  getCounter,
  selectCustomArray, 
  selectCustomLabels, 
  selectActivePets
} from 'store/selectors';

import { Button } from 'components/button';

import { setActivePetType, setActivePetId } from 'store/actions';


require('themes/app.scss');


const $Stage = styled.section`
  position:relative;

  background-color:  ${themeGet('color', 'black')};
  color: ${themeGet('color', 'blue')};
  border: .5rem dashed ${themeGet('color', 'blue')};

  border-radius: 2rem;
  padding: 2rem;
  margin: 2rem;
  box-shadow: 0rem 0rem 2rem ${themeGet('color', 'blue')};

  height: calc(100% - ${themeGet('value', 'headerHeight')});

  h2{
    color: ${themeGet('color', 'white')};
  }
`

const $SelectionContainer = styled.div`
  width:30%;
  height:100%;
  vertical-align:top;
  display:inline-block;
`;

const $CageContainer = styled.div`
  width:70%;
  height:100%;
  vertical-align:top;
  display:inline-block;
`;

const $TypeList = styled.ul`

  padding: 0;
  margin: 0;
  list-style:none;

  >li{
    display: inline-block;
  }
`

const $ObjectsList = styled.ul`

  padding: 0;
  margin: 0;
  list-style:none;

  >li{
    margin:.5rem;

    color: ${themeGet('color', 'white')}
  }
`


class Stage extends Component {

  render(){
    const { 
      customArray, 
      activePetType, 
      activePetId,
      activeObjects, 
      setActivePetType, 
      setActivePetId,
    } = this.props;

    return(
      <$Stage>
        <$SelectionContainer>
          <h2>{'Select a pet'}</h2>

          <$TypeList>
            { customArray.map((c, i) => (
              <li key={i}>
                <Button text={c} isActive={c === activePetType} onClick={() => setActivePetType(c)}/>
              </li>
            ))}
          </$TypeList>
          <$ObjectsList>
            { activeObjects.map((o, i) => (
              <li key={i}>
                <Button text={`${o.name} the ${o.animal}`} isActive={o.id === activePetId} onClick={() => setActivePetId(o.id)}/>
              </li>
            ))}
          </$ObjectsList>
        </$SelectionContainer>
        <$CageContainer>
          <Cage/>
        </$CageContainer>
      </$Stage>
    );
  }
}

const mapStateToProps = (state) => ({
  customTitle: state.data.customData && state.data.customData.customTitle,
  activePetType: getActivePetType(state),
  activePetId: getActivePetId(state),
  counter: getCounter(state),
  customArray: selectCustomArray(state),
  customLabels: selectCustomLabels(state),
  activeObjects: selectActivePets(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setActivePetType, setActivePetId },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stage)

