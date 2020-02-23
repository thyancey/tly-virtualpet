import { createAction } from 'redux-actions';

export const incrementXp = createAction('INCREMENT_XP');
export const setMood = createAction('SET_MOOD');
export const setActivity = createAction('SET_ACTIVITY');
export const resetPet = createAction('RESET_PET');

export const augmentStat = createAction('AUGMENT_STAT', (id, value) => ({
  id: id,
  value: value
}));