import validators from '@/validators'

export class AsyncValidationError extends Error {
  constructor(errors, fields) {
    super('Async Validation Error')
    this.errors = errors
    this.fields = fields
  }
}

/*
展开错误字段名到对象
输入的格式
[
  { "message": "姓名为必填项", "field": "name" },
  { "message": "年龄超出范围", "field": "information.age" }
]
返回的格式
{
  "name": [{ "message": "姓名为必填项", "field": "name" }],
  "information.age": [{ "message": "年龄超出范围", "field": "information.age" }]
}
*/

export function inflateErrorFields(errors) {
  if (!errors || !errors.length)
    return null

  const ret = {}
  errors.forEach((error) => {
    const field = error.field

    ret[field] = ret[field] || []
    ret[field].push(error)
  })
  return ret
}

/*
展开规则字段到数组
输入格式：series
{
  "name": [
    {
      "rule": {
        "required": true,
        "message": "姓名为必填项",
        "field": "name",
        "fullField": "name",
        "type": "string"
      },
      "value": "",
      "source": { "information": { "age": 20 }, "name": "" },
      "field": "name"
    }
  ]
}
输出格式：ret
[
  {
    "rule": {
      "required": true,
      "message": "姓名为必填项",
      "field": "name",
      "fullField": "name",
      "type": "string"
    },
    "value": "",
    "source": { "information": { "age": 20 }, "name": "" },
    "field": "name"
  }
]
*/

export function flattenRuleFields(series) {
  const ret = []
  Object.keys(series).forEach((field) => {
    ret.push(...series[field])
  })
  return ret
}

// 统一错误格式
export function unifyError(unitSeriesRule) {
  // 错误数组，不要改变其指针，一旦改变闭包毫无意义
  const errors = []

  // 统一格式并压入数组
  const addError = (error = []) => {
    // 数组化
    error = Array.isArray(error) ? error : [error]
    // 清空数组(目的是保证其指针不变)
    errors.length = 0
    errors.push(...error)
  }

  const formattErrors = () => {
    // 格式化数组
    const formattErrorsArr = errors.map((error) => {
      if (error && error.message) {
        error.field = error.field || unitSeriesRule.fullField
        return {
          message: error.message,
          field: error.field,
        }
      }
      return {
        message: typeof error === 'function' ? error() : error,
        field: error.field || unitSeriesRule.fullField,
      }
    })
    // 清空数组(目的是保证其指针不变)
    errors.length = 0
    errors.push(...formattErrorsArr)
  }

  return [
    errors,
    addError,
    formattErrors,
  ]
}

// 获取类型
export function getType(singleRule) {
  if (!singleRule.type && singleRule.pattern instanceof RegExp)
    singleRule.type = 'pattern'

  if (
    typeof singleRule.validator !== 'function'
    && singleRule.type
    && !Object.prototype.hasOwnProperty.call(validators, singleRule.type)
  )
    throw new Error(`No validator could be found for type: ${singleRule.type}`)

  return singleRule.type || 'string'
}

// 规范validator属性，统一处理方式
export function getValidator(singleRule) {
  // 已赋值值
  if (typeof singleRule.validator === 'function')
    return singleRule.validator

  return validators[getType(singleRule)] || false
}
