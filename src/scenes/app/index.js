import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { setActivePetId, loadExternalItem } from '@store/actions';
import { selectPetFromWindow } from '@store/selectors/routes';
import { selectIsLoadingComplete} from '@store/selectors';
import { saveAllPetStatsToCookieNow } from '@util/pet-store';
import { themeGet } from '@themes/';

import Loader from './loader';
import Pinger from './pinger';
import Main from './main';
import Editor from './editor';
import Menu from '@scenes/menu';

const S = {};
S.App = styled.section`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  overflow:hidden;

  background-color:  ${themeGet('color', 'black')};
  color: ${themeGet('color', 'blue')};
`

class AppContainer extends Component {
  constructor(){
    super();
    global.spriteScale = 1; //- used to change sprite size/bounds, gets updated in cage.js when window is resized

    window.addEventListener('beforeunload', (e) => {
      this.onExitPage();
    });
  }

  onExitPage(){
    if(this.props.loadingComplete) saveAllPetStatsToCookieNow();
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.loadingComplete && !prevProps.loadingComplete){
      this.onLoadComplete();
    }
  }

  onLoadComplete(){
    console.log('Load complete.');
    this.loadDeeplinkedPet();
  }

  /* if query starts with "external_", then its a url to an external pet/manifest file and should be loaded */
  loadDeeplinkedPet(force){
    const petQuery = selectPetFromWindow();
    console.log('loadDeeplinkedPet', petQuery)

    if(petQuery && (force || !this.props.activePetId)){
      const queryPieces = petQuery.split('external_');
      if(queryPieces.length > 1){
        console.log(`--> Loading external pet with id "${queryPieces[1]}`);
        
        this.props.loadExternalItem({ type: 'pets', url: queryPieces[1], id: `external_${queryPieces[1]}` });
      }else{
        this.props.setActivePetId(queryPieces[0]);
      }
    }
  }

  render(){
    return(
      <S.App id="app" >
        <Pinger />
        <Loader/>
        <Menu />
        <Route path='/' component={Main}></Route>
        <Route path='/editor' component={Editor}></Route>
      </S.App>
    );
  }
}


const mapStateToProps = (state, props) => ({
  loadingComplete: selectIsLoadingComplete(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setActivePetId, loadExternalItem },
    dispatch
  );

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer))
