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
import DropMenu from 'components/ui/dropmenu';

import { setActivePetType, setActivePetId } from 'store/actions';


require('themes/app.scss');


const $PetSelection = styled.div`

  h2{
    color: ${themeGet('color', 'black')};
    text-shadow: .25px .25px 1.5px ${themeGet('color', 'black')};
  }
`;

const $TypeList = styled.ul`

  padding: 0;
  margin: 0;
  list-style:none;

  >li{
    display: inline-block;
    width:100%;
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
    const { 
      taxonomy,
      activePetType, 
      activePetId,
      activeObjects, 
      setActivePetType
    } = this.props;

    return(
      <$PetSelection>
        <h2>{'Select a pet'}</h2>

        <$TypeList>
          { taxonomy.map((c, i) => (
            <li key={i}>
              <DropMenu 
                text={c.type} 
                isActive={c.type === activePetType} 
                onClick={() => setActivePetType(c.type)}
                onItemClick={(payload, e) => this.onSelectPet(payload)}
                activeId={activePetId}
                items={activeObjects.map(aO => ({ ...aO, text:aO.name, subText:aO.animal }))}
                />
            </li>
          ))}
        </$TypeList>
      </$PetSelection>
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

