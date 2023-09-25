import utils from '@/utils'

const pattern = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: /^(?!mailto:)(?:(?:http|https|ftp):\/\/|\/\/)(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00A1-\uFFFF0-9]+-*)*[a-z\u00A1-\uFFFF0-9]+)(?:\.(?:[a-z\u00A1-\uFFFF0-9]+-*)*[a-z\u00A1-\uFFFF0-9]+)*(?:\.(?:[a-z\u00A1-\uFFFF]{2,})))|localhost)(?::\d{2,5})?(?:(\/|\?|#)[^\s]*)?$/i,
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
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
    && !!value.match(pattern.email)
    && value.length < 255
  },
  url(value) {
    return typeof value === 'string' && !!value.match(pattern.url)
  },
  hex(value) {
    return typeof value === 'string' && !!value.match(pattern.hex)
  },
  date(value) {
    return typeof value.getTime === 'function'
    && typeof value.getMonth === 'function'
    && typeof value.getYear === 'function'
    && !Number.isNaN(value.getTime())
  },
  regexp(value) {
    if (value instanceof RegExp)
      return true

    try {
      return !!(new RegExp(value))
    }
    catch (e) {
      return false
    }
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
    'url',
    'hex',
    'date',
    'regexp',
  ]

  const ruleType = rule.type

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
