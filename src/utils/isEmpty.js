import isExtendStringType from './isExtendStringType'

export default function isEmpty(value, type) {
  if ([undefined, null].includes(value))
    return true
  // 利用Object.keys的特性可以直接取object或者array的属性键
  if (typeof value === 'object' && Object.keys(value).length === 0)
    return true
  if ((typeof value === 'string' || isExtendStringType(type)) && value === '')
    return true

  return false
}
