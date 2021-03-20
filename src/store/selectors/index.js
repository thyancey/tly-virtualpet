
import { createSelector } from 'reselect';
import { getPets, getPetDeltaStats, getStatRules, getTaxonomy  } from '@util/pet-store';
import { getSceneDefinition } from '../../util/item-store';
import { getPetDefinition } from '../../util/pet-store';
import { evaluateCondition } from '../../util/tools';

export const getNextManifestItem = state => state.data.nextManifestItem || null;
export const getNextExternalItem = state => state.data.nextExternalItem || null;
export const getExtrasLoaded = state => state.data.extrasLoaded || 0;
export const getDataLoadComplete= state => state.data.loadingComplete || 0;

export const getSettings = state => state.data.settings;

export const getActivePetType = state => state.data.activePetType || null;
export const getCounter = state => state.data.counter;
export const getActivePetId = state => state.activePet.id || null;
export const getForcedBehavior = state => state.activePet.forcedBehavior || null;
export const getActivePetStats = state => state.activePet.stats || null;
export const getActivePet = state => state.activePet || null;
export const getPing = state => state.data.ping || 0;

export const selectSettingPingRate = createSelector(
  [getSettings],
  (settings) => {
    if(!settings) return -1;
    return settings.pingRate;
  }
);

export const selectSettingVolume = createSelector(
  [getSettings],
  (settings) => {
    if(!settings) return -1;
    return settings.volume;
  }
);

export const selectSettingAnimationSpeed = createSelector(
  [getSettings],
  (settings) => {
    if(!settings) return -1;
    return settings.animationSpeed;
  }
);

export const selectNextManifestItem = createSelector(
  [getNextManifestItem],
  (nextManifestItem = null) => {
    return nextManifestItem;
  }
);

export const selectNextExternalItem = createSelector(
  [getNextExternalItem],
  (nextExternalItem = null) => {
    return nextExternalItem;
  }
);


export const selectIsLoadingComplete = createSelector(
  [getDataLoadComplete],
  (loadingComplete = false) => {
    return loadingComplete || false;
  }
);

export const selectActivePets = createSelector(
  [getActivePetType, getPets],
  (activePetType, allPets) => {
    if(!activePetType || !allPets) return [];

    return allPets.filter(o => o.type === activePetType);
  }
);


export const selectActivePetId = createSelector(
  [getActivePetId],
  (activePetId = null) => {
    return activePetId;
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

export const selectActiveScene = createSelector(
  [selectActivePetData],
  (activePetData) => {
    if(!activePetData) return null;
    console.log('selectActiveScene', activePetData);

    const sceneId = activePetData.scene;
    const scene = getSceneDefinition(sceneId);
    if(scene){
      return scene;
    }else{
      return null;
    }
  }
);


export const selectActiveCage = createSelector(
  [selectActivePetData],
  (activePetData) => {
    if(!activePetData) return null;

    const sceneId = activePetData.scene;
    const scene = getSceneDefinition(sceneId);
    if(scene && scene.cage){
      return scene.cage;
    }else{
      return null;
    }
  }
);

export const selectActiveSceneType = createSelector(
  [selectActivePetData],
  (activePetData) => {
    if(!activePetData) return null;

    const sceneId = activePetData.scene;
    const scene = getSceneDefinition(sceneId);
    if(scene && scene.type){
      return scene.type;
    }else{
      return null;
    }
  }
);

export const selectActiveSceneFloorOffset = createSelector(
  [selectActiveScene],
  (activeScene) => {
    if(!activeScene) return null;

    return activeScene.cage.floor || 0;
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

const createSpriteObj = (label, overlayLabel, graphic, sprite, assetDir = '') => {
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

  const imageUrl = `${assetDir}/${sprite.imageUrl}`;
  let overlayUrl = overlayLabel && sprite.overlays && sprite.overlays[overlayLabel] || null;
  if(overlayUrl){
    overlayUrl = `${assetDir}/${overlayUrl}`;
  }

  return {
    type: sprite.type,
    imageUrl: imageUrl,
    overlayUrl: overlayUrl,
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
      cells: sprite.spriteInfo.cells,
      hitboxOffset: sprite.spriteInfo.hitboxOffset || [0, 0]
    }
  };
}


export const selectActivePetActivities = createSelector(
  [selectActivePet],
  (activePet) => {
    if(!activePet) return null;
    
    return activePet.activities;
  }
);

export const selectActiveDeltaStats = createSelector(
  [selectActivePet, getPing],
  (activePet, ping) => {
    if(!activePet) return null;

    const statRules = getStatRules(activePet.id);

    const ds = getDeltaStatsArray(activePet, statRules);
    return ds;
  }
);

export const selectActiveSceneStyles = createSelector(
  [selectActiveScene],
  (activeScene) => {
    console.log('selectActiveSceneStyle', activeScene);
    if(!activeScene) {
      return null;
    }
    return activeScene.styles;
  }
)


export const selectActiveMoods = createSelector(
  [selectActivePet, selectActiveDeltaStats],
  (activePet, deltaStats) => {
    if(!activePet || !deltaStats) return [];

    let activeMoods = [];
    deltaStats.forEach(stat => {
      if(!stat.effects || stat.effects.length === 0) return;
      const deltaStatActiveMoods = getActiveMoods(stat.effects, stat);
      deltaStatActiveMoods.forEach(dsam => {
        if(activeMoods.indexOf(dsam) === -1) activeMoods.push(dsam);
      })
    });
  
    return activeMoods;
  }
);

const evaluateModifier = (whenObj, statObj) => {
  if(evaluateCondition(whenObj.when, statObj)){
    return whenObj.then;
  }else{
    return null;
  }

}

const getActiveMoods = (whenMoods, statObj) => {

  let matchedMoods = [];
  for(let i = 0; i < whenMoods.length; i++){
    const result = evaluateModifier(whenMoods[i], statObj)
    if(result && matchedMoods.indexOf(result) === -1) matchedMoods.push(result);
  }

  return matchedMoods;
}

const getFullStatEffectObj = (moods, stat) => {
  // console.log(stat, moods);
  const effects = stat.effects || [];
  return effects.map(effect => ({
    when: effect.when,
    then: effect.then,
    mood: {
      id: effect.then,
      ...moods[effect.then]
    }
  }));
}

const getDeltaStatsArray = (activePet, statRules) => {
  if(!activePet || !activePet.id) return [];

  const deltaStats = getPetDeltaStats(activePet.id, new Date().getTime());

  return deltaStats.map((stat, idx) => {
    const statPercent = (stat.current / stat.max) * 100;

    // console.log('ac', activePet)
    
    return {
      id: stat.id,
      type: stat.type,
      label: stat.label || stat.id,
      cur: stat.current,
      max: stat.max,
      percent: statPercent,
      fullIsGood: statRules[idx].fullIsGood,
      doesKill: statRules[idx].doesKill,
      fillType: 'fill',
      effects: getFullStatEffectObj(activePet.data.moods, stat)
    }
  });
} 


export const evaluateMoods = (whenMoods, currentMoods) => {
  let moodsMatched = [];

  for(let i = 0; i < whenMoods.length; i++){
    if(currentMoods.indexOf(whenMoods[i]) === -1){
      break;
    }else{
      moodsMatched.push(whenMoods[i]);
    }
  }

  return moodsMatched.length === whenMoods.length;
}

export const evaluateWhen = (when, moodSwingData) => {
  // console.log('evaluateWhen()', when, moodSwingData);

  switch(when.type){
    case 'moods': {
      if(evaluateMoods(when.moods, moodSwingData.activeMoods)){
        return when;
      }else{
        return null;
      }
    }
    case 'activity': {
      if(moodSwingData.activities.indexOf(when.activity) > -1){
        return when;
      }else{
        return null;
      }
    }
    case 'stat': {
      const statValue = moodSwingData.stats.find(s => s.id === when.stat);
      if(statValue === null){
        console.error(`evaluateWhen(): stat "${when.stat}" does not exist for pet`);
        return null;
      }

      const statResult = evaluateCondition(when.value, statValue);
      if(statResult){
        return when;
      }else{
        // console.log(`....evaluateWhen(): stat "${when.stat}" evaluated false for pet`);
        return null;
      }
    }
    case 'status': {
      if(when.isDead === true){
        return moodSwingData.status.isDead === true ? when : null;
      }else if(when.isDead === false){
        return moodSwingData.status.isDead === false ? when : null;
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

export const checkMoodSwingForBehavior = (moodSwings, moodSwingData) => {
  let behavior = null;
  // console.log('checkMoodSwingForBehavior', moodSwingData);
  //- check each swing
  for(let i = 0; i < moodSwings.length; i++){
    const m = moodSwings[i];

    let whenResult = null;
    if(!m.when || m.when.length === 0){
      whenResult = true;
    }else{
      for(let w = 0; w < m.when.length; w++){
  
        //- if any when is false, skip this swing
        whenResult = evaluateWhen(m.when[w], moodSwingData);
  
        if(!whenResult){
          break;
        }
      }
    }

    if(whenResult){
      behavior = m.then;
      break;
    }else{
      behavior = 'DEFAULT'
    }
  };
  
  return behavior || 'ERROR';
}

export const selectCurrentPetBehavior = createSelector(
  [selectActivePet, selectActiveDeltaStats, selectActivePetActivities, selectActiveMoods, getForcedBehavior],
  (activePet, deltaStats, activities, activeMoods, forcedBehavior) => {
    // console.log('selectCurrentPetBehavior');
    if(!activePet || !activePet.id){
      return 'PET NOT FOUND';
    }
    const petDef = getPetDefinition(activePet.id);
    if(!petDef){
      return 'PET DEFINTION NOT FOUND';
    }

    if(forcedBehavior){
      return forcedBehavior;
    }else{
      const status = {
        isDead: activePet && !activePet.isAlive || false
      }
  
      const newBehavior = checkMoodSwingForBehavior(petDef.moodSwings, {
        status: status,
        stats: deltaStats,
        activities: activities,
        activeMoods: activeMoods
      });
  
      // console.warn('newBehavior is ', newBehavior);
      return newBehavior;
    }
  }
);

export const selectActivePetAnimation = createSelector(
  [selectActivePet, selectCurrentPetBehavior],
  (activePet, behavior) => {
    if(!activePet) return null;

    const aData = activePet.data;
    const statusObj = aData.behaviors[behavior] || aData.behaviors.DEFAULT;
    const sprites = aData.sprites;

    if(!statusObj){
      console.error(`Error getting behavior ${behavior}`);
      return null;
    }
    const animIdx = Math.floor(Math.random() * statusObj.animations.length)
    const animationLabel = statusObj.animations[animIdx];
    const overlayLabel = statusObj.overlay || null;

    const foundAnimation = aData.animations[animationLabel];
    if(foundAnimation){
      const sprite = sprites[foundAnimation.sprite];

      if(animationLabel && foundAnimation && sprite){
        const spriteObj = createSpriteObj(animationLabel, overlayLabel, foundAnimation, sprite, `${aData.dir}/assets`);
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