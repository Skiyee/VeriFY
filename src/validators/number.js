import utils from '../utils'
import rules from '../rules'

export default function number(rule, value, callback, source, options) {
  const errors = []
  const validate = rule.required || Object.prototype.hasOwnProperty.call(source, rule.field)

  if (validate) {
    if (utils.isEmpty(value) && !rule.required)
      return callback([])

    rules.required(rule, value, source, errors, options)

    if (!utils.isEmpty(value)) {
      rules.type(rule, value, source, errors, options)
      rules.range(rule, value, source, errors, options)
    }
  }
  callback(errors)
}
