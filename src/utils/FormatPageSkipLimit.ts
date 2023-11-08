export const MAX_ITEM_PER_PAGE = 10;

export const formatPageSkipLimit = (
  page: number,
  limit: number,
  max = MAX_ITEM_PER_PAGE,
) => {
  const pageValid = page && page > 0 ? page : 1;
  const limitValid = limit && limit > 0 && limit < max ? limit : max;
  const skipValid = (pageValid - 1) * limitValid;

  return {
    pageValid: +pageValid,
    limitValid: +limitValid,
    skipValid,
  };
};
