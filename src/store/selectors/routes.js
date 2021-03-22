
import { getSearchObj } from '@util/tools';

export const selectPetFromSearchQuery = queryString => {
  if(!queryString) return null;

  const obj = getSearchObj(queryString);
  return obj.pet || null;
}