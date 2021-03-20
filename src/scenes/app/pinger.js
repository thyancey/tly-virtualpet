import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ping } from '@store/actions';
import { selectSettingPingRate } from '@store/selectors';

require('@themes/app.scss');

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

  onPing(){
    this.props.ping();

    if(this.props.pingRate && this.props.pingRate > 0){
      this.startStatPinger(this.props.pingRate);
    }else{
      this.killStatPinger();
    }

  }

  startStatPinger(pingRate){
    this.killStatPinger();

    this.statPinger = global.setTimeout(() => {
      this.onPing();
    }, this.props.pingRate);
  }

  killStatPinger(){
    if(this.statPinger){
      global.clearInterval(this.statPinger);
      this.statPinger = null;
    }
  }

  render(){
    return null;
  }
}

const mapStateToProps = (state) => ({
  pingRate: selectSettingPingRate(state)
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

