
import { createSelector } from 'reselect';
import { getSearchObj } from 'util/tools';


export const getLocation = state => state.router.location || {};
export const getSearch = state => state.router.location.search || null;

export const selectPath = createSelector(
  [getLocation],
  (locationData = {}) => {
    return locationData.pathname || null
  }
);
export const selectDeeplinkedPet = createSelector(
  [getSearch],
  (searchString = null) => {
    if(!searchString) return null;

    const obj = getSearchObj(searchString);
    return obj.pet || null;
  }
);