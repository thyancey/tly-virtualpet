
import { createSelector } from 'reselect';
import { getPets, getSprites } from 'util/pet-store';
import { getSceneDefinition } from 'util/item-store';

export const getCustomData = state => state.data.customData || {};
export const getActivePetType = state => state.data.activePetType || null;
export const getCounter = state => state.data.counter;
export const getActivePetId = state => state.activePet.id || null;
export const getActivePetStats = state => state.activePet.stats || null;
export const getActivePet = state => state.activePet || null;


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

export const selectActivePetAnimation = createSelector(
  [selectActivePet, getSprites],
  (activePet, sprites) => {
    if(!activePet|| !sprites) return null;
    const aData = activePet.data;


    const activity = activePet.activity;
    const animationGroup = aData.animations[activity] || aData.animations.DEFAULT;
    const animIdx = Math.floor(Math.random() * animationGroup.length)
    const animationLabel = animationGroup[animIdx];

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

const selectStats = createSelector(
  [getActivePetId, selectActivePet],

)
export const selectActivePetStats = createSelector(
  [selectActivePet, getActivePetStats],
  (activePet, currentStats) => {
    if(!activePet) return null;

    return {
      level: currentStats.level
    }
  }
);