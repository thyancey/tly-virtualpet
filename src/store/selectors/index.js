
import { createSelector } from 'reselect';
import { getPets, getSprites, getPetDeltaStats, getStatRules, getTaxonomy } from 'util/pet-store';
import { getSceneDefinition } from 'util/item-store';
import { getPetDefinition } from '../../util/pet-store';

export const getLoaded = state => state.data.loaded || false;
export const getExtrasLoaded = state => state.data.extrasLoaded || 0;
export const getLoadingComplete= state => state.data.loadingComplete || 0;
export const getCustomData = state => state.data.customData || {};
export const getActivePetType = state => state.data.activePetType || null;
export const getCounter = state => state.data.counter;
export const getActivePetId = state => state.activePet.id || null;
export const getActivePetStats = state => state.activePet.stats || null;
export const getActivePet = state => state.activePet || null;
export const getPing = state => state.data.ping || 0;

export const selectIsLoadingComplete = createSelector(
  [getLoadingComplete],
  (loaded = false) => {
    return loaded;
  }
);

export const selectCustomLabels = createSelector(
  [getCustomData],
  (customData = {}) => {
    return {
      title: customData.customTitle,
      subTitle: customData.customValue
    }
  }
);

export const selectCustomArray = createSelector(
  [getCustomData],
  (customData = {}) => {
    return customData.customArray || []
  }
);

export const selectCustomValue = createSelector(
  [getCustomData],
  (data) => {
    return data.customValue;
  }
);


export const selectActivePets = createSelector(
  [getActivePetType, getPets],
  (activePetType, allPets) => {
    if(!activePetType || !allPets) return [];

    return allPets.filter(o => o.type === activePetType);
  }
);

export const selectActivePetData = createSelector(
  [getActivePetId, getPets],
  (activePetId, allPets) => {
    if(!activePetId || !allPets) return null;

    const found = allPets.find(p => p.id === activePetId);
    if(found){
      return found;
    }else{
      return null;
    }
  }
);

export const selectActivePet = createSelector(
  [selectActivePetData, getActivePet],
  (activePetData, activePet) => {
    if(!activePetData) return null;

    return {
      ...activePet,
      data: activePetData
    }
  }
);

export const selectActivePetId = createSelector(
  [getActivePet],
  (activePet) => {
    if(!activePet) return null;
    return activePet.id
  }
);

export const selectActiveScene = createSelector(
  [selectActivePetData],
  (activePetData) => {
    if(!activePetData) return null;

    const sceneId = activePetData.scene;
    console.log('sceneId', sceneId)
    const scene = getSceneDefinition(sceneId);
    console.log('scene', scene)
    if(scene){
      return scene;
    }else{
      return null;
    }
  }
);

export const selectActiveSceneFloorOffset = createSelector(
  [selectActiveScene],
  (activeScene) => {
    if(!activeScene) return null;

    return activeScene.floor.offset || 0;
  }
);

const getFallbackValue = (graphic, spriteInfo, defaultValue) => {
  if(graphic !== undefined){
    return graphic;
  }else if(spriteInfo !== undefined){
    return spriteInfo;
  }else{
    return defaultValue;
  }
}

const createSpriteObj = (label, graphic, sprite) => {
  sprite.spriteInfo = sprite.spriteInfo || {};

  let faceDirection;
  if(graphic.faceDirection !== undefined){
    faceDirection = graphic.faceDirection;
  }else if(sprite.spriteInfo.faceDirection !== undefined){
    faceDirection = sprite.spriteInfo.faceDirection;
  }else{
    faceDirection = true;
  }

  
  let orientation;
  if(graphic.orientation !== undefined){
    orientation = graphic.orientation;
  }else if(sprite.spriteInfo.orientation !== undefined){
    orientation = sprite.spriteInfo.orientation;
  }else{
    orientation = 1;
  }

  return {
    type: sprite.type,
    imageUrl: sprite.imageUrl,
    overlayUrl: sprite.overlayUrl,
    label: label,
    spriteInfo:{
      speed: graphic.speed || sprite.spriteInfo.speed || 1,
      faceDirection: faceDirection,
      orientation: orientation,
      dir: graphic.dir || sprite.spriteInfo.dir || 1,
      scale: getFallbackValue(graphic.scale, sprite.spriteInfo.scale, 1),
      frames: getFallbackValue(graphic.frames, sprite.spriteInfo.frames),
      frame: getFallbackValue(graphic.frame, sprite.spriteInfo.frame),
      grid: sprite.spriteInfo.grid,
      cells: sprite.spriteInfo.cells
    }
  };
}

export const selectActivePetActivity = createSelector(
  [selectActivePet],
  (activePet) => {
    if(!activePet) return null;
    
    return activePet.activity;
  }
);


export const selectActiveDeltaStats = createSelector(
  [selectActivePet, getPing],
  (activePet, ping) => {
    if(!activePet) return null;

    const statRules =  getStatRules(activePet.id);

    return getDeltaStatsArray(activePet, statRules);
  }
)

export const selectActiveSceneStyles = createSelector(
  [selectActiveScene],
  (activeScene) => {
    if(!activeScene) return null;
    return activeScene.styles;
  }
)


const getDeltaStatsArray = (activePet, statRules) => {
  if(!activePet || !activePet.id) return [];

  const deltaStats = getPetDeltaStats(activePet.id, new Date().getTime());

  return deltaStats.map((stat, idx) => ({
    id: stat.id,
    type: stat.type,
    label: stat.label || stat.id,
    cur: stat.current,
    max: stat.max,
    percent: (stat.current / stat.max) * 100,
    fullIsGood: statRules[idx].fullIsGood,
    doesKill: statRules[idx].doesKill,
    fillType: 'fill'
  }));
} 

export const VALID_EXPRESSIONS = [ '=', '<', '<=', '>', '>=' ];

export const evaluateExpression = (expression, value, criteria) => {
  if(VALID_EXPRESSIONS.indexOf(expression) === -1){
    console.error(`evaluateExpression(): invalid expression "${expression}" from valueString "${value}"`);
    return false;
  }

  // console.log('evaluateExpression()', expression, value, criteria);

  switch(expression){
    case '=':
      return value === criteria;
    case '<':
      return value < criteria;
    case '<=':
      return value <= criteria;
    case '>':
      return value > criteria;
    case '>=':
      return value >= criteria;
    default: return false;
  }
}

export const evaluateStat = (stat, value, statValue) => {
  const valueTokens = value.split('_');

  const valueExpression = valueTokens[0];
  const valueCriteria = valueTokens[1];
  
  const percentageSplit = valueCriteria.split('%');

  let checkValue;
  let criteria = percentageSplit[0];

  if(percentageSplit.length > 1){
    checkValue = statValue.percent;
  }else{
    checkValue = statValue.cur;
  }

  if(!valueExpression){
    console.error('evaluateSet(), valueExpression is not defined! ', value)
  }
  const expression = evaluateExpression(valueExpression, checkValue, criteria);
  console.log('foundExpression:', expression);
  return expression;
}

export const evaluateWhen = (when, statusObj) => {
  console.log('evaluateWhen()', when, statusObj);

  switch(when.type){
    case 'activity': {
      if(statusObj.activity === when.activity){
        return when;
      }else{
        return null;
      }
    }
    case 'stat': {
      const statValue = statusObj.stats.find(s => s.id === when.stat);
      if(statValue === null){
        // console.error(`evaluateWhen(): stat "${when.stat}" does not exist for pet`);
        return null;
      }

      const statResult = evaluateStat(when.stat, when.value, statValue);
      if(statResult){
        return when;
      }else{
        console.log(`....evaluateWhen(): stat "${when.stat}" evaluated false for pet`);
      }

      if(statusObj.stats === when.activity){
        return when;
      }else{
        return null;
      }
    }
    case 'status': {
      if(when.isDead === true){
        return statusObj.status.isDead === true ? when : null;
      }else if(when.isDead === false){
        return statusObj.status.isDead === false ? when : null;
      }else{
        console.warn(`evaluateWhen(): status is missing "isDead" attribute`);
        return null;
      }
    }
    default: {
      console.error(`unknown when type "${when.type}"`);
      return null;
    }
  }
}

export const checkMoodSwing = (moodSwings, moodSwingData) => {
  let behavior = null;
  //- check each swing
  for(let i = 0; i < moodSwings.length; i++){
    const m = moodSwings[i];

    let whenResult = null;
    for(let w = 0; w < m.when.length; w++){

      //- if any when is false, skip this swing
      whenResult = evaluateWhen(m.when[w], moodSwingData);

      if(!whenResult){
        break;
      }
    }

    if(whenResult){
      // console.log('COMPLETED SWING WITH', m, whenResult);
      behavior = m.then;
      break;
    }else{
      // console.log('AAABBORRTTEDDD SWING on', m);
      behavior = 'NO_BEHAVIOR'
    }
  };
  

  // console.error('done with ', behavior);
    //- each swing


    //- return with the then
  
  //- return with nothing?
  return behavior || 'PLACEHOLDER';
}

export const selectCurrentPetBehavior = createSelector(
  [selectActivePet, selectActiveDeltaStats, selectActivePetActivity],
  (activePet, stats, activity) => {
    if(!activePet || !activePet.id){
      return 'PET NOT FOUND';
    }
    const petDef = getPetDefinition(activePet.id);
    if(!petDef){
      return 'PET DEFINTION NOT FOUND';
    }
    const status = {
      isDead: activePet && !activePet.isAlive || false
    }


    // console.log('pet is ', activePet);
    const newActivity = checkMoodSwing(petDef.moodSwings, {
      status: status,
      stats: stats,
      activity: activity
    });

    console.log('newActivity is ', newActivity);
    return newActivity;
  }
);

export const selectActivePetAnimation = createSelector(
  [selectActivePet, getSprites, selectCurrentPetBehavior],
  (activePet, sprites, behavior) => {
    if(!activePet|| !sprites) return null;
    const aData = activePet.data;

    console.log('AP', activePet)

    const activity = behavior;
    // const activity = activePet.activity;
    const activityObj = aData.activities[activity] || aData.activities.DEFAULT;
    if(!activityObj){
      console.error(`Error getting activity ${activity}`);
      return null;
    }
    const animIdx = Math.floor(Math.random() * activityObj.animations.length)
    const animationLabel = activityObj.animations[animIdx];

    const foundGraphic = aData.graphics[animationLabel];
    if(foundGraphic){
      const sprite = sprites[foundGraphic.sprite];

      if(animationLabel && foundGraphic && sprite){
        const spriteObj = createSpriteObj(animationLabel, foundGraphic, sprite);
        return spriteObj;
      }else{
        console.error(`Error getting spriteObj for ${animationLabel}`);
        return null;
      }
    }else{
      console.error(`Error getting graphic for ${animationLabel}`);
      return null;
    }
  }
);

export const selectPetTaxonomy = createSelector(
  [getTaxonomy],
  (taxonomy = []) => {
    return taxonomy
  }
);