import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fetch from 'node-fetch';
import { jsonc } from 'jsonc';

import { setManifest, storeManifestItem, setActivePetId } from '@store/actions';
import { selectNextManifestItem, selectNextExternalItem } from '@store/selectors';

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
    
    const nextExternalItem = this.props.nextExternalItem;
    if(nextExternalItem){
      if(!prevProps.nextExternalItem || prevProps.nextExternalItem.url !== nextExternalItem.url){
        //- load each pet def
        this.loadManifestItem(nextExternalItem);
        global.setTimeout(() => {this.props.setActivePetId(nextExternalItem.id)}, 500);
      }
    }
  }

  loadAllData(){
    this.loadManifestData('manifest', 'manifest.jsonc');
  }

  loadManifestItem(manifestItemObj){
    if(!manifestItemObj){
      console.error('Loader.loadManifestItem, received null manifestItemObj');
    }
    // console.log('loadManifestItem', manifestItemObj)

    const url =  `${manifestItemObj.url}/data.jsonc`;
    // const manifestLabel = `( [${manifestItemObj.type}]: ${manifestItemObj.id} )`;
    // console.log(`reading manifestItem data for ${manifestLabel} from '${url}'`);

    fetch(url, {
      mode: 'cors'
    })
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
          console.error(`Error parsing data from manifestObj ${manifestItemObj} (or the url (${url}) was bad), skipping`, err?.stack || err);
        }
      );
  }

  loadManifestData(type, location){
    const url =  `${dataLocation}/${location}`;
    console.log(`reading ${type} data from '${url}'`);

    fetch(url)
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
          this.props.setManifest(json);
          return true;
        }, 
        err => {
          console.error(`Error parsing ${type} data (or the url was bad), skipping`, err?.stack || err);
        }
      );
  }


  render(){
    return null;
  }
}

const mapStateToProps = (state, props) => ({
  nextManifestItem: selectNextManifestItem(state),
  nextExternalItem: selectNextExternalItem(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setManifest, storeManifestItem, setActivePetId  },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadHelper)

