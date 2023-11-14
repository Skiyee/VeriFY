import utils from '../utils'

export default function required(rule, value, source, errors, options) {
  if (
    rule.required
    && (
      !Object.prototype.hasOwnProperty.call(source, rule.field)
      || utils.isEmpty(value)
    )
  ) {
    errors.push(
      utils.format(utils.format(options.messages.required, rule.fullField)),
    )
  }
}
