import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ping } from 'store/actions';

const STAT_PING_RATE = 1000;

require('themes/app.scss');

class Pinger extends Component {

  constructor(){
    super();
    this.statPinger = null;

    this.state = {
      pingIdx: 0
    }
  }

  componentDidMount(){
    this.props.ping();
    this.startStatPinger();
  }

  startStatPinger(){
    this.killStatPinger();

    this.statPinger = global.setInterval(() => {
      //- send ping action
      this.props.ping();
    }, STAT_PING_RATE);
  }

  killStatPinger(){
    if(this.statPinger){
      global.clearTimeout(this.statPinger);
      this.statPinger = null;
    }
  }

  render(){
    return null;
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { ping },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pinger)

