/* eslint-disable no-prototype-builtins */
import utils from '../utils'
import { AsyncValidationError, flattenRuleFields, getType, getValidator, inflateErrorFields, unifyError } from './helps'

/**
rule: {
  type: 'array',
  required: true,
  allField: { type: 'url' },
}
 */
function createDeepSchema(unitSeries) {
  // 某个rule序列化后的对象值rule: [{unitSeries}]
  const { rule: unitSeriesRule, value: unitSeriesValue } = unitSeries

  let deep = ['array', 'object'].includes(unitSeriesRule.type) && (typeof unitSeriesRule.fields === 'object' || typeof unitSeriesRule.allField === 'object')

  deep = deep && (unitSeriesRule.required || unitSeriesValue)

  if (!deep)
    return null

  // 某一数组下值设置allField的处理
  const rules = {}

  if (unitSeriesRule.allField) {
    const valueFieldArr = unitSeriesValue.keys()
    for (const valueField of valueFieldArr)
      rules[valueField] = unitSeriesRule.allField
  }

  Object.assign(rules, unitSeriesRule.fields)

  // 深层对象/数组的子属性
  for (const ruleField in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, ruleField)) {
      // 取出子属性并数组化每一个rule
      const rule = Array.isArray(rules[ruleField]) ? rules[ruleField] : [rules[ruleField]]

      rules[ruleField] = rule.map(schema => ({
        ...schema,
        fullField: `${unitSeriesRule.fullField}.${ruleField}`,
      }))
    }
  }

  return new Schema(rules)
}

export default class Schema {
  constructor(descriptor) {
    // 校验规则
    this.rules = null
    // 初始数据源
    this.source = null
    // 已序列化数据源
    this.series = null
    // 配置
    this.options = null

    // 返回信息配置
    this._messages = utils.messages

    this.define(descriptor)
  }

  /*
  rules: 多个字段规则所集合成的规则
  rule: 每一个单一规则所集合成的规则
  singleRule: 单一规则
  rules:{
    rule1:[]
    rule2:[
      singleRule2-1: val{}
      singleRule2-2: val{}
    ],
  }
  */

  // 将每一个规则都做转换: object|array->array
  // 目的：嵌入更多校验条件
  // 转换形成序列化处理前
  define(rules) {
    if (!rules)
      throw new Error('需要有校验规则才能初始化')

    if (typeof rules !== 'object' || Array.isArray(rules))
      throw new Error('校验规则必须是对象类型')

    // 校验规则
    this.rules = {}
    // 源数据
    this.source = {}
    // 已序列化数据源
    this.series = {}

    // 将每一个规则转换成Array
    Object.keys(rules).forEach((field) => {
      const rule = rules[field]
      this.rules[field] = Array.isArray(rule) ? rule : [rule]
    })
  }

  initValidate(source, options = {}, callback) {
    // 当没有参数设置时
    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    // 初始化排除错误
    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (callback)
        callback()
      return Promise.resolve()
    }

    if (!options.messages)
      options.messages = this._messages

    if (!options.first)
      options.first = true

    this.source = source
    this.options = options
    this.callback = callback
  }

  // 序列化
  /**
  const this.rules = {
    list: [
      {
        required: true,
        type: 'number',
      }
    ]
    limit: [
      {
        required: true,
        message: '数量必填',
      },
      {
        validator(r, v, cb) {
          if (v < 100) {
            return cb(new Error('数量不能小于 100'));
          }
          cb();
        },
      },
    ],
  };
   */
  serialize(source) {
    const seriesTemp = {}

    const fields = Object.keys(this.rules)

    fields.forEach((field) => {
      // 当前字段规则 array 类型
      const rule = this.rules[field]
      // 当前字段所对应的值
      const value = source[field]

      rule.forEach((singleRule) => {
        // 解引用
        singleRule = Object.assign({}, singleRule)

        // 根据一些props生成validator
        // 目的：规范validator属性，统一处理方式
        singleRule.validator = getValidator(singleRule)
        if (!singleRule.validator)
          return

        singleRule.field = field
        singleRule.fullField = singleRule.fullField || field
        singleRule.type = getType(singleRule)
        // 赋值初始化数据
        seriesTemp[field] = seriesTemp[field] || []
        seriesTemp[field].push({
          rule: singleRule,
          value,
          source,
          field,
        })
      })
    })
    this.series = seriesTemp
  }

  /*
  unitSeries:
  {
    rule: {
      required: true,
      type: 'number',
      field: 'list',
      ...
    },
    value: 1,
  }
  */
  initCb(unitSeries, doIt) {
    return (error = []) => {
      const { rule: unitSeriesRule, value: unitSeriesValue } = unitSeries
      const [errors, addError, formattErrors] = unifyError(unitSeriesRule)

      addError(error)

      // 这里会把检测错误的默认模板置换成用户设置的错误模板
      if (errors.length && unitSeriesRule.message)
        addError(unitSeriesRule.message)

      // 启动格式化
      formattErrors()

      // 有配置first时吗，当检测含有错误时就直接返回
      if (this.options.first && errors.length)
        return doIt(errors)

      // 深层遍历：
      const schema = createDeepSchema(unitSeries)

      if (!schema) {
        doIt(errors)
      }
      else {
        // 当前rule是必填的并且没有值
        if (unitSeriesRule.required && !unitSeriesValue) {
          if (unitSeriesRule.message) {
            addError(unitSeriesRule.message)
            formattErrors()
          }
          return doIt(errors)
        }

        schema.validate(unitSeriesValue, unitSeriesRule.options, (childrenErrors) => {
          const finalErrors = []
          if (errors && errors.length)
            finalErrors.push(...errors)

          if (childrenErrors && childrenErrors.length)
            finalErrors.push(...childrenErrors)

          doIt(finalErrors.length ? finalErrors : null)
        })
      }
    }
  }

  singleValidator(unitSeries, doIt) {
    // 某个rule序列化后的对象值rule(field): [{unitSeries-1},{unitSeries-2}]
    const { rule: unitSeriesRule, value: unitSeriesValue } = unitSeries

    const cb = this.initCb(unitSeries, doIt)

    let res
    if (unitSeriesRule.validator) {
      res = unitSeriesRule.validator(unitSeriesRule, unitSeriesValue, cb, this.source, this.options)

      // 若是自定义validator那么就会执行这里
      if (res === true)
        cb()

      else if (res === false)
        cb(unitSeriesRule.message || `${unitSeriesRule.field} fails`)

      else if (Array.isArray(res))
        cb(res)

      else if (res instanceof Error)
        cb(res.message)
    }
  }

  // 终止的回调函数
  completeCallback(res) {
    let errors = []
    let fields = {}

    res.forEach((error) => {
      error = Array.isArray(error) ? error : [error]
      errors.push(...error)
    })

    if (!errors.length) {
      errors = null
      fields = null
    }
    else {
      fields = inflateErrorFields(errors)
    }
    this.callback(errors, fields)
  }

  // 串行校验
  // 与singleValidator形成递归，当遇到错误或完成时执行asyncMap里的end结束递归
  asyncSerialArray(arr, func, endCallback) {
    let index = 0
    const arrLength = arr.length
    const next = (errors) => {
      // end：遇到错误
      if (errors && errors.length)
        return endCallback(errors)

      // container: 持续递归
      const original = index++
      if (original < arrLength) {
        // singleValidator
        func.call(this, arr[original], next)
      }
      else {
        // end：完成判断
        endCallback([])
      }
    }

    // 判断的开始(递归的开始)
    next([])
  }

  // 校验入口函数
  asyncMap(objArr, options, func, callback) {
    // this有作用域问题，因为完成的回调里需要用到this.callback
    const that = this
    // first属性与串行校验挂钩
    if (options.first) {
      const pending = new Promise((resolve, reject) => {
        // 结束的回调函数
        const end = (errors) => {
          // 这是产生错误提示的关键，也就是终止的回调函数completeCallback
          callback.call(that, errors)

          const inflateObj = inflateErrorFields(errors)
          const errorPrototype = new AsyncValidationError(errors, inflateObj)

          return errors.length ? reject(errorPrototype) : resolve()
        }

        // 启动的校验函数
        // 扁平化
        const flattenArr = flattenRuleFields(objArr)
        // 串行校验
        this.asyncSerialArray(flattenArr, func, end)
      })
      pending.catch(e => e)
      return pending
    }
  }

  /**
  生成结果：
  list: [
    {
      rule: {
        required: true,
        type: 'number',
        field: 'list',
        fullField: 'list',
        validator: (rule, value, callback, source, options) => {
          const errors = [];
          const validate =
            rule.required ||
            (!rule.required && source.hasOwnProperty(rule.field));
          if (validate) {
            if (value === '') {
              value = undefined;
            }
            if (isEmptyValue(value) && !rule.required) {
              return callback();
            }
            rules.required(rule, value, source, errors, options);
            if (value !== undefined) {
              rules.type(rule, value, source, errors, options);
              rules.range(rule, value, source, errors, options);
            }
          }
          callback(errors);
        },
      },
      value: '12',
      source: {
        list: '12',
        limit: 3,
      },
      field: 'list',
    },
  ]
   */

  /**
  validator.validate(
    source: { list: '12', limit: 3 },
    options: { firstFields: true },
    callback: (errors, fields) => {
      if (errors) {
        console.log('错误列表', errors);
      }
    },
  );
   */

  // 校验器
  validate(source_, options_, callback_) {
    // 初始化配置参数: 副作用是this.options
    this.initValidate(source_, options_, callback_)

    // 生成序列化数据： 副作用this.series | this.source
    this.serialize(source_)

    // 校验函数入口
    return this.asyncMap(
      this.series,
      this.options,
      this.singleValidator,
      this.completeCallback,
    )
  }
}
