import utils from '../utils'

export default function required(rule, value, source, errors, options, type) {
  if (
    rule.required
    && (!Object.prototype.hasOwnProperty.call(source, rule.field)
    || utils.isEmpty(value, type || rule.type))
  ) {
    errors.push(
      utils.format(utils.format(options.messages.required, rule.fullField)),
    )
  }
}
