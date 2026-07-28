/** Matches server `passwordSchema` in auth.validator.js */
export function validatePassword(value) {
  if (!value || value.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (value.length > 128) {
    return 'Password must be at most 128 characters'
  }
  if (!/[A-Z]/.test(value)) {
    return 'Password must contain an uppercase letter'
  }
  if (!/[a-z]/.test(value)) {
    return 'Password must contain a lowercase letter'
  }
  if (!/[0-9]/.test(value)) {
    return 'Password must contain a number'
  }
  return true
}

export const PASSWORD_HINT =
  'At least 8 characters with uppercase, lowercase, and a number.'
