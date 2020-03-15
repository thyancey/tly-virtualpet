import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet, shadeColor } from 'themes/';

import { 
  setActivePetType, 
  setActivePetId 
} from 'store/actions';

import { 
  getActivePetType,
  getActivePetId,
  getCounter,
  selectPetTaxonomy,
  selectActivePets
} from 'store/selectors';

import DropMenu from 'components/ui/dropmenu';

const $Body = styled.div`
  ul{
    padding:0;
    margin: 0;
    list-style:none;

    >li{
      display: inline-block;
      width:100%;

      &:last-of-type{
        margin-bottom: 2rem;
      }
    }
  }
`;


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
      setActivePetType,
    } = this.props;

    return(
      <$Body>
        <ul>
          {taxonomy.map((c, i) => (
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
        </ul>
      </$Body>
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

