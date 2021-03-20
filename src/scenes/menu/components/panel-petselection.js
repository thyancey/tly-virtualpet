import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet, shadeColor } from '@themes/';

import { 
  setActivePetType, 
  setActivePetId,
  loadExternalItem
} from '@store/actions';

import { 
  getActivePetType,
  getActivePetId,
  getCounter,
  selectPetTaxonomy,
  selectActivePets
} from '@store/selectors';

import DropMenu from '@components/ui/dropmenu';
import { LilButton } from '@components/ui/button';

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

  showLoadPrompt(){
    const url = global.prompt('Enter URL to directory containing pet manifest and assets. \n (use the provided url to load the raccoon externally)', 'http://thomasyancey.com/projects/virtualpet-external/pets/rizzo-raccoon');
    if(url){
      this.props.loadExternalItem({ type: 'pets', url: url, id: `external_${url}` });
    }
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
          <li key={0}>
            <LilButton text={'Load external'} onClick={e => this.showLoadPrompt()} />
          </li>
          {taxonomy.map((c, i) => (
            <li key={`${i}-${c.type}`}>
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
    { setActivePetType, setActivePetId, loadExternalItem },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetSelection)

