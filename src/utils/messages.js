function newMessages() {
  return {
    default: '字段 %s 验证错误',
    required: '必须填写 %s',
    enum: '%s 必须是以下之一：%s',
    whitespace: '%s 不能为空',
    date: {
      format: '%s 日期 %s 不符合格式 %s',
      parse: '%s 日期无法解析，%s 无效',
      invalid: '%s 日期 %s 无效',
    },
    types: {
      string: '%s 不是一个 %s',
      method: '%s 不是一个 %s (函数)',
      array: '%s 不是一个 %s',
      object: '%s 不是一个 %s',
      number: '%s 不是一个 %s',
      date: '%s 不是一个 %s',
      boolean: '%s 不是一个 %s',
      integer: '%s 不是一个 %s',
      float: '%s 不是一个 %s',
      regexp: '%s 不是一个有效的 %s',
      email: '%s 不是一个有效的 %s',
      url: '%s 不是一个有效的 %s',
      hex: '%s 不是一个有效的 %s',
    },
    string: {
      len: '%s 必须正好有 %s 个字符',
      min: '%s 至少要有 %s 个字符',
      max: '%s 不能超过 %s 个字符',
      range: '%s 必须在 %s 和 %s 个字符之间',
    },
    number: {
      len: '%s 必须等于 %s',
      min: '%s 不能小于 %s',
      max: '%s 不能大于 %s',
      range: '%s 必须在 %s 和 %s 之间',
    },
    array: {
      len: '%s 必须正好有 %s 个元素',
      min: '%s 不能少于 %s 个元素',
      max: '%s 不能多于 %s 个元素',
      range: '%s 必须在 %s 和 %s 个元素之间',
    },
    pattern: {
      mismatch: '%s 值 %s 不匹配模式 %s',
    },
    clone() {
      const cloned = JSON.parse(JSON.stringify(this))
      cloned.clone = this.clone
      return cloned
    },
  }
}

export default newMessages()
