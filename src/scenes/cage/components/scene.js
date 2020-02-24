import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import { 
  selectActiveScene
} from '../../../store/selectors';

const $Scene = styled.div`
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index:-1;

  .footer-image{
    width: 100%;
    height: 100%;
  }

  .background-image{
    width: 100%;
    height: 100%;
    background-size: cover;
  }
`

const $SceneFloor = styled.div`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height: ${p => `${p.height}px`};

  background-image: url(${p => p.image});
  background-color: ${p => p.color};
`

const $SceneBackground = styled.div`
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index:-1;

`

class Scene extends Component {
  render(){
    // console.log('R: Scene');
    const { 
      activeScene
    } = this.props;


    if(!activeScene){
      return null;
    }else{
      const bgImage = activeScene.background.imageUrl ? activeScene.background.imageUrl : null;
      const floorImage = activeScene.floor.imageUrl ? activeScene.floor.imageUrl : null;
      const bgPosition = activeScene.background.backgroundPosition ? activeScene.background.backgroundPosition : '0';

      /*
        TODO, using styled components with background-image was causing flickering for some reason (not because of re-render)
        so for now, just made them non-styled components
      */
      return(
        <$Scene>
          <$SceneFloor height={activeScene.floor.height} color={activeScene.floor.color} >
            <div className={'footer-image'} style={{ backgroundImage: `url(${floorImage})`}} />
          </$SceneFloor>
          <$SceneBackground style={{ backgroundColor: activeScene.background.color }} >
            <div className={'background-image'} style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: bgPosition }} />
          </$SceneBackground>
        </$Scene>
      );
    }

  }
}

const mapStateToProps = (state) => ({
  activeScene: selectActiveScene(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scene)

