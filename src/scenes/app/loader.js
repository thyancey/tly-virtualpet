import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setCustomData, setOtherData } from 'store/actions';
import fetchy from 'node-fetch';


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
    this.props.setCustomData({
      "tests":[
        {
            "title": "123"
        },
        {
            "title": "234"
        }
      ]
    });
  }

  loadAllData(){
    this.loadStoreData();
    this.loadOtherData('pets', 'pets.json');
    this.loadOtherData('scenes', 'scenes.json');
    this.loadOtherData('items', 'items.json');
  }

  loadOtherData(type, location){
    const url =  `${dataLocation}/${location}`;
   ;
    console.log(`reading ${type} data from '${url}'`);

    fetchy(url).then(response => {
      return response.json();
    }, 
    err => {
      console.error(`Error fretching ${type} data from ${url}`, err);
    }) //- bad url responds with 200/ok? so this doesnt get thrown
      .then(json => {
        console.log(`${type} data was read successfully`, json);
        this.props.setOtherData({ type: type, data: json });
        return true;
      }, 
      err => {
        console.error(`Error parsing ${type} data (or the url was bad), skipping`, err);
      });
  }

  loadStoreData(){
    const url = `${dataLocation}/data.json`;
    console.log(`reading app data from '${url}'`);

    fetchy(url).then(response => {
                      return response.json();
                    }, 
                    err => {
                      console.error('Error fretching url', err);
                      // this.setDefaultData();
                    }) //- bad url responds with 200/ok? so this doesnt get thrown
              .then(json => {
                      console.log('data was read successfully')
                      this.props.setCustomData(json);
                      return true;
                    }, 
                    err => {
                      console.error('Error parsing store JSON (or the url was bad)', err);
                      // this.setDefaultData();
                    })
              .catch(e => {
                console.error('Error parsing store JSON (or the url was bad)', e);
                // this.setDefaultData();
              });
  }


  render(){
    return null;
  }
}

const mapStateToProps = ({ data }, props) => ({
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setCustomData, setOtherData  },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadHelper)

