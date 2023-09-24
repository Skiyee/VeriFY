import rules from '../rules'
import utils from '../utils'

export default function array(rule, value, callback, source, options) {
  const errors = []
  const validate = rule.required || Object.prototype.hasOwnProperty.call(source, rule.field)

  if (validate) {
    if (utils.isEmpty(value, 'array') && !rule.required)
      return callback([])

    rules.required(rule, value, source, errors, options, 'array')

    if (!utils.isEmpty(value, 'array')) {
      rules.type(rule, value, source, errors, options)
      rules.range(rule, value, source, errors, options)
    }
  }
  callback(errors)
}
