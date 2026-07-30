/** Password rules for signup / reset — any non-empty value is accepted. */
export function validatePassword(value) {
  if (!value || !String(value).trim()) {
    return 'Password required'
  }
  if (String(value).length > 128) {
    return 'Password must be at most 128 characters'
  }
  return true
}

export const PASSWORD_HINT = ''
