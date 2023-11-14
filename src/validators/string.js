import rules from '../rules'
import utils from '../utils'

export default function string(rule, value, callback, source, options) {
  const errors = []

  const validate = rule.required || Object.prototype.hasOwnProperty.call(source, rule.field)
  if (validate) {
    if (utils.isEmpty(value) && !rule.required)
      return callback([])

    rules.required(rule, value, source, errors, options)

    if (!utils.isEmpty(value)) {
      rules.type(rule, value, source, errors, options)
      rules.range(rule, value, source, errors, options)
      rules.pattern(rule, value, source, errors, options)
    }
  }
  callback(errors)
}
