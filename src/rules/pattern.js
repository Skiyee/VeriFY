import utils from '@/utils'

export default function pattern(rule, value, source, errors, options) {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      rule.pattern.lastIndex = 0
      if (!rule.pattern.test(value)) {
        errors.push(
          utils.format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern),
        )
      }
    }
    else if (typeof rule.pattern === 'string') {
      const _pattern = new RegExp(rule.pattern)
      if (!_pattern.test(value)) {
        errors.push(
          utils.format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern),
        )
      }
    }
  }
}
