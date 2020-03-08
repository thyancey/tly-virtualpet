import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';
import Loader from './loader';
import Pinger from './pinger';

import { selectDeeplinkedPet } from 'store/selectors/routes';
import { push } from 'connected-react-router';

import { 
  selectActivePetId, selectIsLoadingComplete
} from 'store/selectors';

import { setActivePetId } from 'store/actions';

import { saveAllPetStatsToCookieNow } from 'util/pet-store';

import Stage from 'scenes/stage';

require('themes/app.scss');

const $App = styled.section`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  overflow:hidden;

  background-color:  ${themeGet('color', 'black')};
  color: ${themeGet('color', 'blue')};
`

const $Stage = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:1;
`


class App extends Component {
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
    this.loadDeeplinkedPet();
  }

  loadDeeplinkedPet(force){
    if(this.props.queryPet && (force || !this.props.activePetId)){
      this.props.setActivePetId(this.props.queryPet);
    }
  }

  render(){
    // global.test = this;
    // console.log('R: App', this.props );

    return(
      <$App id="app" >
        <Pinger />
        <Loader/>
        <$Stage>
          <Stage />
        </$Stage>
      </$App>
    );
  }
}

const mapStateToProps = (state) => ({
  loadingComplete: selectIsLoadingComplete(state),
  queryPet: selectDeeplinkedPet(state),
  activePetId: selectActivePetId(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { push, setActivePetId },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

