import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';

import Pet from '../../components/pet';
import { 
  selectActivePet
} from '../../store/selectors';

import {} from 'store/actions/pet';


const $Cage = styled.div`
  position:relative;

  width:100%;
  height:100%;

  color: ${themeGet('color', 'blue')};
  border: .5rem dashed ${themeGet('color', 'black')};

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
    if(!prevProps.activePet && this.props.activePet){
      this.onResize();
    }
  }

  componentDidMount() {
    global.addEventListener('resize', this.onResize);
  }

  onResize(){
    this.updateCanvasDims();
  }

  updateCanvasDims(){
    if(this.containerRef.current){
      this.setState({
        containerWidth: this.containerRef.current.offsetWidth,
        containerHeight: this.containerRef.current.offsetHeight
      })
    }
  }

  render(){
    const { 
      activePet
    } = this.props;

    if(!activePet){
      return null;
    }else{
      return(
        <$Cage ref={this.containerRef} >
          <Pet 
            petData={activePet} 
            containerWidth={this.state.containerWidth}
            containerHeight={this.state.containerHeight} />
        </$Cage>
      );
    }

  }
}

const mapStateToProps = (state) => ({
  activePet: selectActivePet(state)
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

