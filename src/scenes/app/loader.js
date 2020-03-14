import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fetchy from 'node-fetch';
import { jsonc } from 'jsonc';

import { setOtherData, setManifest, storeManifestItem } from 'store/actions';
import { selectNextManifestItem } from 'store/selectors';


let dataLocation = './data';

class LoadHelper extends Component {

  constructor(){
    super();

    this.loadAllData();
  }

  componentDidUpdate(prevProps, prevState){
    const nextManifestItem = this.props.nextManifestItem;
    if(nextManifestItem){
      if(!prevProps.nextManifestItem || prevProps.nextManifestItem.id !== nextManifestItem.id){
        //- load each pet def
        this.loadManifestItem(nextManifestItem);
      }
    }
  }

  loadAllData(){
    this.loadOtherData('manifest', '_manifest.jsonc');
    this.loadOtherData('scenes', 'scenes.jsonc');
    this.loadOtherData('items', 'items.jsonc');
  }

  loadManifestItem(manifestItemObj){
    if(!manifestItemObj){
      console.error('Loader.loadManifestItem, received null manifestItemObj');
    }

    const url =  `${manifestItemObj.url}/data.jsonc`;
    const manifestLabel = `"${manifestItemObj.id}" (${manifestItemObj.type})`;
    console.log(`reading manifestItem data for ${manifestLabel} from '${url}'`);

    fetchy(url)
      .then(res => res.text())
      .then(
        text => jsonc.parse(text), 
        err => {
          console.error(`Error fretching item from manifestObj ${manifestItemObj} from ${url}`, err);
        }
      ) //- bad url responds with 200/ok? so this doesnt get thrown
      .then(
        json => {
          // console.log(`manifestItem ${manifestLabel} was read successfully`, json);
          this.props.storeManifestItem({ manifest: manifestItemObj, data: json })

          return true;
        }, 
        err => {
          console.error(`Error parsing data from manifestObj ${manifestItemObj} (or the url (${url}) was bad), skipping`, err && err.stack || err);
        }
      );
  }

  loadOtherData(type, location){
    const url =  `${dataLocation}/${location}`;
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
          // console.log(`${type} data was read successfully`, json);
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

const mapStateToProps = (state, props) => ({
  nextManifestItem: selectNextManifestItem(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setOtherData, setManifest, storeManifestItem  },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadHelper)

