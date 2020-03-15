import { 
  setManifest,
  storeManifestItem,
  setActivePetType,
  setActivePetId,
  ping
} from '../actions';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions';
import { getPetDefinition, setFromPetManifest } from 'util/pet-store';
import { setFromSceneManifest } from 'util/item-store';
import { getNextManifestData, setManifestStages } from 'util/manifest-helper';

const VALID_KEYS = [ 'title', 'stages' ];
const RESTRICT_KEYS = false;
 
const initialState = {
  loadingComplete: false,
  title: 'loading',
  customData: null,
  counter: 0,
  activePetType: null,
  activePetId: null,
  ping: 0,
  nextManifestItem: null
}

export default handleActions({
  [setManifest.toString()]: (state, action) => {
    const cleanManifestObj = {};
    const parsedData = action.payload;
    const customData = {};
    for(let key in parsedData){
      if(VALID_KEYS.indexOf(key) === -1){
        console.warn(`key supplied in /data.json "${key}" is not a valid key`);
        if(!RESTRICT_KEYS) cleanManifestObj[key] = parsedData[key];
      }
      else{
        cleanManifestObj[key] = parsedData[key];
        if(key !== 'stages'){
          customData[key] = parsedData[key];
        }
      }
    }
    
    console.log('----------------');
    console.log('starting manifest');
    setManifestStages(parsedData.stages);
    const nextManifestItem = getNextManifestData(0);

    return {
      ...state,
      nextManifestItem,
      loadingComplete: nextManifestItem === null,
      customData
    }
  },

  [storeManifestItem.toString()]: (state, action) => {
    // console.log('storeManifestItem', action.payload);
    const { manifest, data} = action.payload;
    
    if(manifest.type === 'pets'){
      setFromPetManifest(data, manifest)
    }else{
      setFromSceneManifest(data, manifest);
    }

    const nextManifestItem = getNextManifestData(manifest.idx + 1);
    return {
      ...state,
      nextManifestItem,
      loadingComplete: nextManifestItem === null
    }
  },

  [setTransition.toString()]: (state, action) => {
    return {
      ...state,
      transitionLabel: action.payload.label
    }
  },

  [setActivePetType.toString()]: (state, action) => {
    console.log('setActivePetType', action.payload)
    return {
      ...state,
      activePetType: action.payload
    }
  },

  [setActivePetId.toString()]: (state, action) => {
    //- pet existssetPetDefinitions
    const petDef = getPetDefinition(action.payload);
    if(petDef){
      return {
        ...state,
        activePetId: action.payload
      }
    }else{
      console.error(`Could not get pet definition for id "${action.payload}"`);
      return {
        ...state
      }
    }
  },

  [ping.toString()]: (state) => {
    return {
      ...state,
      ping: state.ping + 1
    }
  },
}, initialState);
