import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimationCanvas from './animation-canvas/';

import { themeGet } from 'themes/';
import ReactImageFallback from 'react-image-fallback';
import Image_404Pet from './assets/unknown-pet.jpg';

const $PetContainer = styled.div`
  position:relative;
  height: 100%;
`;

class Pet extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.onResize = this.onResize.bind(this);
    this.state = {
      canvasWidth: 500,
      canvasHeight:500
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  onResize(){
    // console.log('onrsizes')
    this.updateCanvasDims();
  }

  updateCanvasDims(){

    this.setState({
      canvasWidth: this.containerRef.current.offsetWidth,
      canvasHeight: this.containerRef.current.offsetHeight
    })
  }

  render(){
    const { canvasWidth, canvasHeight } = this.state;
    const { level, imageUrl } = this.props;

    return (
      <$PetContainer ref={this.containerRef}>
        <AnimationCanvas canvasWidth={canvasWidth} canvasHeight={canvasHeight}/>
      </$PetContainer>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    {},
    dispatch
  )
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pet);
