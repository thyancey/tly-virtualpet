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

  background-color: ${p => p.color};
  background-position: ${p => p.backgroundPosition};
`

const $BgImage = styled.div`
  background-image: url(${p => p.image});
  width: 100%;
  height: 100%;
  background-size: cover;
`;

class Scene extends Component {
  render(){
    const { 
      activeScene
    } = this.props;

    console.log('activeScene', activeScene)

    if(!activeScene){
      return null;
    }else{
      console.log('scene is ', activeScene);
      const bgImage = activeScene.background.imageUrl ? activeScene.background.imageUrl : null;
      const bgPosition = activeScene.background.backgroundPosition ? activeScene.background.backgroundPosition : '0';

      return(
        <$Scene>
          <$SceneFloor image={activeScene.floor.imageUrl} height={activeScene.floor.height} color={activeScene.floor.color} >

          </$SceneFloor>
          <$SceneBackground color={activeScene.background.color} >
            {bgImage && <$BgImage image={bgImage} backgroundPosition={bgPosition} />}
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

