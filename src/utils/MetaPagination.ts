const MAX_LIMIT = process.env.MAX_LIMIT_PER_PAGE || '100';

export const validatePagination = (
  page: number = 1,
  limit: number = +MAX_LIMIT,
) => {
  const limitValid = limit < 0 || limit > +MAX_LIMIT ? +MAX_LIMIT : limit;
  const pageValid = page <= 0 ? page : 1;
  const skipValid = (pageValid - 1) * limitValid;

  return {
    skipValid,
    pageValid,
    limitValid,
  };
};

export const metaPagination = (
  total: number,
  perPage: number,
  page: number = 1,
  limit: number = +MAX_LIMIT,
) => {
  return {
    totalPage: Math.ceil(total / limit),
    page,
    limit,
    perPage,
    total,
  };
};
