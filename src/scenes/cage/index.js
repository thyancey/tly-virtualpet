import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from '@themes/';
import { clamp } from '@util/tools';

import Pet from '../../components/pet';
import { 
  selectActivePetId
} from '../../store/selectors';

import Scene from './components/scene';

const S = {};
S.Cage = styled.div`
  position:relative;

  width:100%;
  height:100%;

  color: ${themeGet('color', 'blue')};

  h2{
    color: ${themeGet('color', 'white')};
  }
`

class Cage extends Component {
  constructor(props){
    super(props);

    this.containerRef = React.createRef();
    this.onResize = this.onResize.bind(this);

    this.state = {
      containerWidth: 500,
      containerHeight: 500
    }
  }

  componentDidUpdate(prevProps){
    //- when the first canavs is rendered, check the page bounds
    if(!prevProps.activePetId && this.props.activePetId){
      this.onResize();
    }
  }

  componentDidMount() {
    global.addEventListener('resize', this.onResize);
    this.onResize();
  }

  onResize(){
    this.updateCanvasDims();
  }

  updateCanvasDims(){
    if(this.containerRef.current){
      const squishers = {
        x: clamp((this.containerRef.current.offsetWidth / 1000), .3, 1),
        y: clamp((this.containerRef.current.offsetHeight / 1000), .3, 1)
      }
      // global.spriteScale = squishers.x < squishers.y ? squishers.x : squishers.y;
      this.setState({
        containerWidth: this.containerRef.current.offsetWidth,
        containerHeight: this.containerRef.current.offsetHeight
      })
    }
  }

  render(){
    const { 
      activePetId
    } = this.props;

    if(!activePetId){
      return null;
    }else{
      return(
        <S.Cage ref={this.containerRef} >
          <Pet 
            activePetId={activePetId} 
            containerWidth={this.state.containerWidth}
            containerHeight={this.state.containerHeight}
            />
          <Scene />
        </S.Cage>
      );
    }

  }
}

const mapStateToProps = (state) => ({
  activePetId: selectActivePetId(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cage)

