import React, { Component } from 'react';
import styled from 'styled-components';
import { createGame, updateBounds } from './game';
import { debounce } from 'throttle-debounce';


const S = {};
S.PhaserContainer = styled.div`
  display:block;
`;

class PhaserComponent extends Component {
  componentDidMount(){
    createGame({
      id: `phaser-container-${this.props.id}`
    });

    this.debouncedUpdateBounds = debounce(500, false, updateBounds);
  }

  componentDidUpdate(prevProps){
    if(prevProps.width !== this.props.width || prevProps.height !== this.props.height){
      this.debouncedUpdateBounds(0, 0, this.props.width, this.props.height);
    }
  }

  render(){
    return(
      <S.PhaserContainer id={`phaser-container-${this.props.id}`} />
    );
  }
}

export default PhaserComponent;
