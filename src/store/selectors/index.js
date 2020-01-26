
import { createSelector } from 'reselect';

export const getCustomData = state => state.data.customData || {};
export const getActivePetType = state => state.data.activePetType || null;
export const getActivePetId = state => state.data.activePetId || null;
export const getCounter = state => state.data.counter;


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

export const selectActivePet = createSelector(
  [getActivePetId, selectPets],
  (activePetId, allPets) => {
    if(!activePetId || !allPets) return null;

    return allPets.find(p => p.id === activePetId);
  }
);

const getStatObj = (label, stats, baseStats, fillType) => {
  if(stats[label] && baseStats[label]){
    const percent = Math.round((stats[label] / baseStats[label]) * 100);

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