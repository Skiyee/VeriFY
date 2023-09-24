import utils from './index'

export default function isEmpty(value, type) {
  if ([undefined, null].includes(value))
    return true
  if (type === 'array' && Array.isArray(value) && !value.length)
    return true

  if (utils.isExtendStringType(type) && typeof value === 'string' && !value)
    return true

  return false
}
