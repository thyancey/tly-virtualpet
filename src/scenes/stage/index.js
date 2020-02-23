import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import Cage from 'scenes/cage';
import Menu from '../menu';

import {} from 'store/selectors';


require('themes/app.scss');


const $Stage = styled.section`
  position:relative;
  width: 100%;
  height: 100%;

  padding: 2rem;

  h2{
    color: ${themeGet('color', 'white')};
  }
`

const $MenuContainer = styled.div`
  position:fixed;
  top:0;
  right:0;
  z-index:1;
`;

const $CageContainer = styled.div`
  width:100%;
  height:100%;
`;



class Stage extends Component {
  render(){
    const { } = this.props;

    return(
      <$Stage>
        <$MenuContainer id="menu-container">
          <Menu />
        </$MenuContainer>
        <$CageContainer>
          <Cage/>
        </$CageContainer>
      </$Stage>
    );
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stage)

