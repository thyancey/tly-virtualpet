
import { createSelector } from 'reselect';

export const getCustomData = state => state.data.customData || {};
export const getActivePetType = state => state.data.activePetType || null;
export const getActivePetId = state => state.data.activePetId || null;
export const getCounter = state => state.data.counter;
export const getSprites = state => state.data.customData && state.data.customData.sprites || {};
export const getGraphics = state => state.data.customData && state.data.customData.graphics || {};


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

const selectPets = createSelector(
  [getCustomData],
  (data) => {
    return data.pets || [];
  }
);

export const selectActivePets = createSelector(
  [getActivePetType, selectPets],
  (activePetType, allPets) => {
    if(!activePetType || !allPets) return [];

    return allPets.filter(o => o.type === activePetType);
  }
);

// export const selectActivePet = createSelector(
//   [getActivePetId, selectPets, getSprites],
//   (activePetId, allPets, sprites) => {
//     if(!activePetId || !allPets || !sprites) return null;

//     const found = allPets.find(p => p.id === activePetId);
//     if(found){
//       let animationLabel = found.animations.idle[0];
//       if(animationLabel && sprites[animationLabel]){
//         return { ...found, animation: { ...sprites[animationLabel], label: animationLabel } }
//       }else{
//         console.error('Error getting animation');
//         return null;
//       }
//     }else{
//       return null;
//     }
//   }
// );

export const selectActivePet = createSelector(
  [getActivePetId, selectPets],
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

const createSpriteObj = (graphics, sprites, label) => {
  const graphic = graphics[label];
  const sprite = sprites[graphic.sprite];
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
  [selectActivePet, getSprites, getGraphics],
  (activePet, sprites, graphics) => {
    if(!activePet || !sprites || !graphics) return null;

    const mood = 'idle';
    const animationGroup = activePet.animations[mood] || activePet.animations.idle;
    const animIdx = Math.floor(Math.random() * animationGroup.length)
    const animationLabel = animationGroup[animIdx];

    if(animationLabel && graphics[animationLabel]){
      const spriteObj = createSpriteObj(graphics, sprites, animationLabel);
      return spriteObj;
    }else{
      console.error('Error getting animation');
      return null;
    }
  }
);

const getStatObj = (label, stats, baseStats, fillType) => {
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

export const selectActivePetStats = createSelector(
  [selectActivePet],
  (activePet) => {
    if(!activePet) return null;

    return {
      level: activePet.stats.level,
      xp:{
        cur: activePet.stats.xp,
        max: 1000,
        percent: Math.round((activePet.stats.xp / 1000) * 100),
        fillType: 'none'
      },
      stomach: getStatObj('stomach', activePet.stats, activePet.baseStats, 'fill'),
      bladder: getStatObj('bladder', activePet.stats, activePet.baseStats, 'empty'),
      happyness: getStatObj('happyness', activePet.stats, activePet.baseStats, 'fill')
    }
  }
);