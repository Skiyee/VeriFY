import utils from '../utils'

const patternRule = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  mobile: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/g,
}

const types = {
  number(value) {
    return Number.isNaN(value) ? false : typeof value === 'number'
  },
  integer(value) {
    return types.number(value) && Number.parseInt(value, 10) === value
  },
  float(value) {
    return types.number(value) && !types.integer(value)
  },
  array(value) {
    return Array.isArray(value)
  },
  object(value) {
    return typeof value === 'object' && !types.array(value)
  },
  method(value) {
    return typeof value === 'function'
  },
  email(value) {
    return typeof value === 'string'
    && !!value.match(patternRule.email)
    && value.length < 255
  },
  date(value) {
    return typeof value.getTime === 'function'
    && typeof value.getMonth === 'function'
    && typeof value.getYear === 'function'
    && !Number.isNaN(value.getTime())
  },
  mobile(value) {
    return typeof value === 'string' && !!value.match(patternRule.mobile)
  },
  pattern(value) {
    return typeof value === 'string'
  },
  money(value) {
    return types.number(value) && types.integer(value)
  },
}

export default function type(rule, value, source, errors, options) {
  const custom = [
    'number',
    'integer',
    'float',
    'array',
    'object',
    'method',
    'email',
    'date',
    'mobile',
    'pattern',
    'money',
  ]

  const ruleType = rule.extend || rule.type

  if (custom.includes(ruleType)) {
    if (!types[ruleType](value)) {
      errors.push(
        utils.format(options.messages.types[ruleType], rule.fullField, ruleType),
      )
    }
  }
  // eslint-disable-next-line valid-typeof
  else if (ruleType && typeof value !== ruleType) {
    errors.push(
      utils.format(options.messages.types[ruleType], rule.fullField, ruleType),
    )
  }
}
