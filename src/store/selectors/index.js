
import { createSelector } from 'reselect';

export const getCustomData = state => state.data.customData || {};
export const getActiveType = state => state.data.activeType || null;
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

const selectCustomObjects = createSelector(
  [getCustomData],
  (data) => {
    return data.customObjects || [];
  }
);

export const selectActiveObjects = createSelector(
  [getActiveType, selectCustomObjects],
  (activeType, objects) => {
    if(!activeType || !objects) return [];

    return objects.filter(o => o.type === activeType);
  }
);