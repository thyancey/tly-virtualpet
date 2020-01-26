import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import { 
  getActivePetType,
  getActivePetId,
  getCounter,
  selectCustomArray, 
  selectCustomLabels, 
  selectActivePets
} from 'store/selectors';

import Button from 'components/button';

import { setActivePetType, setActivePetId, incrementCounter, decrementCounter } from 'store/actions';

import TestImage from './assets/loading.gif';

require('themes/app.scss');


const $Example = styled.section`
  position:relative;

  background-color:  ${themeGet('color', 'black')};
  color: ${themeGet('color', 'blue')};
  border: .5rem dashed ${themeGet('color', 'blue')};

  border-radius: 2rem;
  padding: 2rem;
  margin: 2rem;
  box-shadow: 0rem 0rem 2rem ${themeGet('color', 'blue')};

  h2{
    color: ${themeGet('color', 'white')};
  }
`

const $ImageExamples = styled.div`
`

const $CounterExample = styled.div`
  position:absolute;
  top:1rem;
  right:2rem;

  text-align:center;
  padding: 1rem;
  max-width:50rem;
  
  >div>*{
    display:inline-block;
    vertical-align:middle;
    min-width:5rem;
  }
`

const $CustomLabels = styled.div`
  margin:1rem;

  h4{
    float:left;
    margin-right:.5rem;
  }

  p{
    color: ${themeGet('color', 'green')}
  }
`;

const $TypeSelection = styled.div`
  margin:1rem;
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


class Example extends Component {

  render(){
    const { 
      customTitle, 
      customLabels, 
      customArray, 
      activePetType, 
      activePetId,
      activeObjects, 
      counter, 
      setActivePetType, 
      setActivePetId,
      incrementCounter, 
      decrementCounter 
    } = this.props;

    return(
      <$Example>
        <h1>{'Examples'}</h1>
        <$ImageExamples>
          <img src={TestImage} alt="loading"/>
        </$ImageExamples>

        <$CounterExample>
          <h3>{'Change this number'}</h3>
          <div>
            <Button text={'-'} onClick={() => decrementCounter()}/>
            <span>{counter}</span>
            <Button text={'+'} onClick={() => incrementCounter()}/>
          </div>
        </$CounterExample>

        <hr/>
        <p style={{textAlign:'center',fontStyle:'italic'}}>{ `(This is sourced from custom data at './public/data.json')` }</p>
        <$CustomLabels>
          <h2>{'Custom Labels'}</h2>
          <h4>{'customTitle:'}</h4>
          <p>{customTitle}</p>
          <h4>{'selector-driven label:'}</h4>
          <p>{ `${customLabels.title}~~~~"${customLabels.subTitle}"` }</p>
        </$CustomLabels>
        <br/>
        <$TypeSelection>
          <h2>{' Pick a type '}</h2>

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
        </$TypeSelection>
      </$Example>
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
    { setActivePetType, setActivePetId, incrementCounter, decrementCounter },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Example)

