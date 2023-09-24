import utils from '../utils'

export default function range(rule, value, source, errors, options) {
  const hasLen = typeof rule.len === 'number'
  const hasMin = typeof rule.min === 'number'
  const hasMax = typeof rule.max === 'number'

  const isStr = rule.type === 'string'
  const isNum = rule.type === 'number'
  const isArr = rule.type === 'array'

  const stringRegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g

  let keyType = null
  let val = value

  if (isStr)
    keyType = 'string'
  else if (isNum)
    keyType = 'number'
  else if (isArr)
    keyType = 'array'

  if (!keyType)
    return false

  if (isStr)
    val = String(value).replace(stringRegExp, '_').length

  if (isArr)
    val = value.length

  if (hasLen) {
    if (val !== rule.len) {
      errors.push(
        utils.format(options.messages[keyType].len, rule.fullField, rule.len),
      )
    }
  }
  else if (!hasMax && hasMin && val < rule.min) {
    errors.push(
      utils.format(options.messages[keyType].min, rule.fullField, rule.min),
    )
  }
  else if (!hasMin && hasMax && val > rule.max) {
    errors.push(
      utils.format(options.messages[keyType].max, rule.fullField, rule.max),
    )
  }
  else if (hasMin && hasMax && (val < rule.min || val > rule.max)) {
    errors.push(
      utils.format(options.messages[keyType].range, rule.fullField, rule.min, rule.max),
    )
  }
}
