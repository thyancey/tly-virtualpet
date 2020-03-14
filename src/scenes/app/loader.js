import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fetchy from 'node-fetch';
import { jsonc } from 'jsonc';

import { setOtherData, setManifest } from 'store/actions';


let dataLocation = './data';

class LoadHelper extends Component {

  constructor(){
    super();
    // if(global.location.href.indexOf('localhost') > -1){
    //   dataLocation = './dev-data';
    // }

    this.loadAllData();
  }

  setDefaultData(){
    // this.props.setCustomData({
    //   "tests":[
    //     {
    //         "title": "123"
    //     },
    //     {
    //         "title": "234"
    //     }
    //   ]
    // });
  }

  loadAllData(){
    this.loadOtherData('manifest', '_manifest.jsonc');
    this.loadOtherData('pets', 'pets.jsonc');
    this.loadOtherData('scenes', 'scenes.jsonc');
    this.loadOtherData('items', 'items.jsonc');
  }

  loadOtherData(type, location){
    const url =  `${dataLocation}/${location}`;
   ;
    console.log(`reading ${type} data from '${url}'`);

    fetchy(url)
      .then(res => res.text())
      .then(
        text => {
          return jsonc.parse(text);
        }, 
        err => {
          console.error(`Error fretching ${type} data from ${url}`, err);
        }
      ) //- bad url responds with 200/ok? so this doesnt get thrown
      .then(
        json => {
          console.log(`${type} data was read successfully`, json);
          if(type === 'manifest'){
            this.props.setManifest(json);
          }else{
            this.props.setOtherData({ type: type, data: json });
          }
          return true;
        }, 
        err => {
          console.error(`Error parsing ${type} data (or the url was bad), skipping`, err && err.stack || err);
        }
      );
  }


  render(){
    return null;
  }
}

const mapStateToProps = ({ data }, props) => ({
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setOtherData, setManifest  },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadHelper)

