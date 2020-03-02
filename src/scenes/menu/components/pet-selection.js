import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import { 
  getActivePetType,
  getActivePetId,
  getCounter,
  selectPetTaxonomy,
  selectActivePets
} from 'store/selectors';

import { Button } from 'components/button';

import { setActivePetType, setActivePetId } from 'store/actions';


require('themes/app.scss');


const $PanelPadding = styled.div`
  width:100%;
  height:100%;
  position:relative;
`;


const $PetSelection = styled.div`
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
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


class PetSelection extends Component {

  onSelectPet(id){
    this.props.setActivePetId(id);
    this.props.onSelectPet(id);
  }

  render(){
    console.log('R: PetSelection');
    const { 
      taxonomy,
      activePetType, 
      activePetId,
      activeObjects, 
      setActivePetType
    } = this.props;

    return(
      <$PanelPadding>
        <$PetSelection>
          <h2>{'Select a pet'}</h2>

          <$TypeList>
            { taxonomy.map((c, i) => (
              <li key={i}>
                <Button text={c.type} isActive={c.type === activePetType} onClick={() => setActivePetType(c.type)}/>
              </li>
            ))}
          </$TypeList>
          <$ObjectsList>
            { activeObjects.map((o, i) => (
              <li key={i}>
                <Button text={`${o.name} the ${o.animal}`} isActive={o.id === activePetId} onClick={() => this.onSelectPet(o.id)}/>
              </li>
            ))}
          </$ObjectsList>
        </$PetSelection>
        
      </$PanelPadding>
    );
  }
}

const mapStateToProps = (state) => ({
  activePetType: getActivePetType(state),
  activePetId: getActivePetId(state),
  counter: getCounter(state),
  taxonomy: selectPetTaxonomy(state),
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
)(PetSelection)

