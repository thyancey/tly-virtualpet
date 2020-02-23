import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import Cage from 'scenes/cage';
import Menu from 'scenes/menu';
import Info from 'scenes/info';

import {} from 'store/selectors';


require('themes/app.scss');

const MENU_WIDTH = '18rem';


const $Stage = styled.section`
  position:relative;
  width: 100%;
  height: 100%;

  padding: 2rem;
`

const $CageContainer = styled.div`
  /* width:100%;
  height:100%; */
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
`;


const $MenuContainer = styled.div`
  position:fixed;
  width:${MENU_WIDTH};

  top:0;
  right:0;
  z-index:1;
`;

const $InfoContainer = styled.div`
  position:fixed;
  width: calc(100% - ${MENU_WIDTH});

  top:0;
  left:0;
  z-index:1;
`;

const STAT_PING_RATE = 1500;
class Stage extends Component {
  constructor(props){
    super(props);

    this.statPinger = null;

    this.state = {
      pingIdx: 0
    }
  }

  componentDidMount(){
    
    this.startStatPinger();
  }
  

  startStatPinger(){
    this.killStatPinger();

    this.statPinger = global.setInterval(() => {
      this.setState({
        pingIdx: this.state.pingIdx + 1
      });
    }, STAT_PING_RATE);
  }

  killStatPinger(){
    if(this.statPinger){
      global.clearTimeout(this.statPinger);
      this.statPinger = null;
    }
  }


  render(){
    const { } = this.props;

    return(
      <$Stage>
        <$InfoContainer  id="info-container">
          <Info pingIdx={this.state.pingIdx} />
        </$InfoContainer>
        <$MenuContainer id="menu-container">
          <Menu />
        </$MenuContainer>
        <$CageContainer>
          <Cage  pingIdx={this.state.pingIdx} />
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

