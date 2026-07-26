const ApiError = require('../utils/ApiError');
const roleRepository = require('../repositories/role.repository');
const { ROLES } = require('../types/enums');

/**
 * Require one of the given role slugs.
 * @param {...string} roles
 */
const requireRoles = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }

  const slug = req.user.role_slug;
  if (!roles.includes(slug) && slug !== ROLES.SUPER_ADMIN) {
    return next(ApiError.forbidden('Insufficient role'));
  }

  return next();
};

/**
 * Require a permission slug (or super_admin bypass).
 * @param {...string} permissionSlugs
 */
const authorize = (...permissionSlugs) => async (req, _res, next) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    if (req.user.role_slug === ROLES.SUPER_ADMIN) {
      return next();
    }

    const permissions = await roleRepository.getPermissionSlugsByRoleId(req.user.role_id);
    const allowed = permissionSlugs.some((slug) => permissions.includes(slug));

    if (!allowed) {
      throw ApiError.forbidden('Insufficient permissions');
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  requireRoles,
  authorize,
};
