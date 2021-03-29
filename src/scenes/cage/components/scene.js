import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { 
  selectActiveScene
} from '../../../store/selectors';

const S = {};
S.Scene = styled.div`
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

  ${p => p.type === 'responsive' && css`
    .background-image{
      width: 100%;
      height: 100%;
      background-size: cover;
    }
  `}
  
  ${p => p.type === 'static' && css`
    .background-image{
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position:50% 50%;
    }
  `}

`

S.SceneFloor = styled.div`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height: ${p => `${p.height}px`};

  background-image: url(${p => p.image});
  background-color: ${p => p.color};
`

S.SceneBackground = styled.div`
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
      global.alert('ERROR: scene failed to load');
      return null;
    }else{
      const bgImage = activeScene.background.imageUrl ? activeScene.background.imageUrl : null;
      const type = activeScene.type;
      /*
        TODO, using styled components with background-image was causing flickering for some reason (not because of re-render)
        so for now, just made them non-styled components
      */
      return(
        <S.Scene type={type}>
          { activeScene.floor && (
            <S.SceneFloor height={activeScene.floor.height} color={activeScene.floor?.color} >
              <div className={'footer-image'} style={{ backgroundImage: `url(${activeScene.floor?.imageUrl})`}} />
            </S.SceneFloor>
          )}
          <S.SceneBackground style={{ backgroundColor: activeScene.background.color }} >
            <div className={'background-image'} style={{ backgroundImage: `url(${bgImage})`, ...activeScene.background.styles }} />
          </S.SceneBackground>
        </S.Scene>
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

