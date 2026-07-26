const pagination = ({ page = 1, limit = 20, maxLimit = 100 } = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(maxLimit, Math.max(1, Number(limit) || 20));
  const offset = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    offset,
  };
};

const paginatedMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 0,
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

module.exports = {
  pagination,
  paginatedMeta,
};
