import utils from '../utils'

export default function _enum(rule, value, source, errors, options) {
  rule.enums = Array.isArray(rule.enums) ? rule.enums : []

  let isIncludes = false
  if (Array.isArray(value))
    isIncludes = value.every(val => rule.enums.includes(val))
  else
    isIncludes = rule.enums.includes(value)

  if (!isIncludes) {
    errors.push(
      utils.format(options.messages.enum, rule.fullField, rule.enums.join(', ')),
    )
  }
}
