
import { getSearchObj } from '@util/tools';

export const selectPetFromUrl = queryStrring => {
  if(!queryStrring) return null;

  const obj = getSearchObj(queryStrring);
  return obj.pet || null;
}