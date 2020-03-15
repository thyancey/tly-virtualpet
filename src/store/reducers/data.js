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
  manifest:{},
  manifestStages: [],
  nextManifestItem: null,
  manifestStageIdx: 0
}

const returnNextStageItem = (manifestStages, manifestStageIdx, nextItemIdx) => {
  // console.log(`returnNextStageItem: [${manifestStageIdx}, ${nextItemIdx}]`)
  if(manifestStageIdx >= manifestStages.length){
    console.log(`manifestStageIdx ${manifestStageIdx} is >= ${manifestStages.length}, therefore no stages remain`);
    return null;
  }

  const thisStage = manifestStages[manifestStageIdx];
  const nextItem = thisStage.items[nextItemIdx] || null;
  if(nextItem){
    console.log(`returnNextStageItem, returning: [${manifestStageIdx}, ${nextItemIdx}]`)
    return {
      id: nextItem.id,
      url: nextItem.url,
      itemIdx: nextItemIdx,
      stageIdx: manifestStageIdx
    };
  }else{
    return returnNextStageItem(manifestStages, manifestStageIdx + 1, 0);
  }
}

export const getNextManifestData = (stages, curStageIdx, curItemIdx) => {
  const nextItemObj = returnNextStageItem(stages, curStageIdx, curItemIdx);
  if(nextItemObj){
    const nextStage = stages[nextItemObj.stageIdx]

    return {
      nextManifestItem: {
        type: nextStage.type,
        idx: nextItemObj.itemIdx,
        id: nextItemObj.id,
        url: nextItemObj.url
      },
      manifestStageIdx: nextItemObj.stageIdx
    }
  }else{
    console.log('-------------------------');
    console.log('All manifest items loaded.');
    return {
      nextManifestItem: null,
      manifestStageIdx: -1
    }
  }
}

export default handleActions({
  [setManifest.toString()]: (state, action) => {
    const cleanManifestObj = {};
    const parsedData = action.payload;
    const customData = {};
    let stages = [];
    for(let key in parsedData){
      if(VALID_KEYS.indexOf(key) === -1){
        console.warn(`key supplied in /data.json "${key}" is not a valid key`);
        if(!RESTRICT_KEYS) cleanManifestObj[key] = parsedData[key];
      }
      else{
        cleanManifestObj[key] = parsedData[key];
        if(key === 'stages'){
          stages = parsedData[key];
        }else{
          customData[key] = parsedData[key];
        }
      }
    }
    const manifestData = getNextManifestData(stages, 0, 0);

    return {
      ...state,
      ...manifestData,
      manifestStages: stages,
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

    const manifestData = getNextManifestData(state.manifestStages, state.manifestStageIdx, manifest.idx + 1);
    return {
      ...state,
      ...manifestData,
      loadingComplete: manifestData.manifestStageIdx === -1
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
