const store = {
  stages: [],
  stageIdx: 0
}

const returnNextStageItem = (manifestStages, nextItemIdx) => {
  const manifestStageIdx = store.stageIdx;

  if(manifestStageIdx >= manifestStages.length){
    // console.log(`manifestStageIdx ${manifestStageIdx} is >= ${manifestStages.length}, therefore no stages remain`);
    return null;
  }

  const thisStage = manifestStages[manifestStageIdx];
  const nextItem = thisStage.items[nextItemIdx] || null;
  if(nextItem){
    console.log(`... [${manifestStageIdx}, ${nextItemIdx}]`)
    return {
      id: nextItem.id,
      url: nextItem.url,
      itemIdx: nextItemIdx,
      stageIdx: manifestStageIdx
    };
  }else{
    store.stageIdx = store.stageIdx + 1;
    return returnNextStageItem(manifestStages, 0);
  }
}

export const getNextManifestData = (curItemIdx) => {
  const nextItemObj = returnNextStageItem(store.stages, curItemIdx);
  if(nextItemObj){
    const nextStage = store.stages[nextItemObj.stageIdx]

    return {
      type: nextStage.type,
      idx: nextItemObj.itemIdx,
      id: nextItemObj.id,
      url: nextItemObj.url
    }
  }else{
    console.log('All manifest items loaded.');
    console.log('-------------------------');
    return null;
  }
}

export const setManifestStages = (stages) => {
  if(!stages || stages.length === 0){
    console.error('No manifest items loaded, or there was some error');
  }
  store.stages = stages;
}

global.manifestHelper = {
  getAllData: () => store
}

export default store;