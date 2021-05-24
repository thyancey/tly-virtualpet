import { createAction } from 'redux-actions';

export const incrementXp = createAction('INCREMENT_XP');
export const addActivity = createAction('ADD_ACTIVITY');
export const removeActivity = createAction('REMOVE_ACTIVITY');
export const setActivities = createAction('SET_ACTIVITIES');
export const forceBehavior = createAction('FORCE_BEHAVIOR');
export const resetPet = createAction('RESET_PET');
export const killPet = createAction('KILL_PET');
export const clickPet = createAction('CLICK_PET');

export const augmentStat = createAction('AUGMENT_STAT', (id, value) => ({
  id: id,
  value: value
}));

export const augmentStats = createAction('AUGMENT_STATS');