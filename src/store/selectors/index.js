
import { createSelector } from 'reselect';
import { getPets, getSprites, getSavedStats, getBaseStats } from 'util/pet-store';

export const getCustomData = state => state.data.customData || {};
export const getActivePetType = state => state.data.activePetType || null;
export const getCounter = state => state.data.counter;
export const getActivePetId = state => state.activePet.id || null;
export const getActivePetStats = state => state.activePet.stats || null;

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

export const selectActivePet = createSelector(
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

const createSpriteObj = (label, graphic, sprite) => {
  sprite.spriteInfo = sprite.spriteInfo || {};

  return {
    type: sprite.type,
    imageUrl: sprite.imageUrl,
    label: label,
    spriteInfo:{
      speed: graphic.speed || sprite.spriteInfo.speed || 1,
      dir: graphic.dir || sprite.spriteInfo.dir || 1,
      scale: graphic.scale || sprite.spriteInfo.scale || 1,
      frames: graphic.frames || sprite.spriteInfo.frames,
      frame: graphic.frame || sprite.spriteInfo.frame,
      grid: sprite.spriteInfo.grid,
      cells: sprite.spriteInfo.cells
    }
  };
}

export const selectActivePetAnimation = createSelector(
  [selectActivePet, getSprites],
  (activePet, sprites) => {
    if(!activePet || !sprites) return null;

    const mood = 'idle';
    const animationGroup = activePet.animations[mood] || activePet.animations.idle;
    const animIdx = Math.floor(Math.random() * animationGroup.length)
    const animationLabel = animationGroup[animIdx];

    const foundGraphic = activePet.graphics[animationLabel];
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

const getStatObj = (stats, baseStats, label, fillType) => {
  if(stats[label] !== undefined && baseStats[label] !== undefined){

    return {
      cur: stats[label],
      max: baseStats[label],
      percent: Math.round((stats[label] / baseStats[label]) * 100),
      fillType: fillType
    };
  }else{
    return null;
  }
}

const selectStats = createSelector(
  [getActivePetId, selectActivePet],

)
export const selectActivePetStats = createSelector(
  [selectActivePet, getActivePetStats],
  (activePet, currentStats) => {
    if(!activePet) return null;

    const baseStats = getBaseStats(activePet.id);

    return {
      level: currentStats.level,
      xp:{
        cur: currentStats.xp,
        max: 1000,
        percent: Math.round((currentStats.xp / 1000) * 100),
        fillType: 'none'
      },
      stomach: getStatObj(currentStats, baseStats, 'stomach', 'fill'),
      bladder: getStatObj(currentStats, baseStats, 'bladder', 'empty'),
      happyness: getStatObj(currentStats, baseStats, 'happyness', 'fill')
    }
  }
);