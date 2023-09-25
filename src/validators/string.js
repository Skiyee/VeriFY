import rules from '../rules'
import utils from '../utils'

export default function string(rule, value, callback, source, options) {
  const errors = []

  const validate = rule.required || Object.prototype.hasOwnProperty.call(source, rule.field)
  if (validate) {
    // 没有值并且不是必填值
    if (utils.isEmpty(value, 'string') && !rule.required)
      return callback([])

    // 值是必填值
    rules.required(rule, value, source, errors, options, 'string')
    // 不为空
    if (!utils.isEmpty(value, 'string')) {
      rules.type(rule, value, source, errors, options)
      rules.range(rule, value, source, errors, options)
      rules.pattern(rule, value, source, errors, options)
    }
  }

  callback(errors)
}
