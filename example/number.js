import Schema from '../dist/index.cjs'

// 普通类型
const desc = {
  min: { required: true, type: 'number', min: 1 },
  max: { required: true, type: 'number', max: 8 },
  range: { required: true, type: 'number', min: 1, max: 8 },
  length: { required: true, type: 'number', len: 8 },
}

const source = {
  min: 6,
  max: 8,
  range: 8,
  length: 6,
}

const validator = new Schema(desc)

validator.validate(source, (error) => {
  console.log('number:', error)
})

// 拓展类型
const moneyDesc = {
  money_min: { required: true, type: 'number', extend: 'money', min: 666666 },
  money_max: { required: true, type: 'number', extend: 'money', max: 666666 },
  money_range: { required: true, type: 'number', extend: 'money', min: 666666, max: 888888 },
}

// 乘于100是因为money字段解决精度问题
const moneySource = {
  money_min: 66666600,
  money_max: 66666600,
  money_range: 99999999,
}

const moneyValidator = new Schema(moneyDesc)

moneyValidator.validate(moneySource, (error) => {
  console.log('money:', error)
})

const ratioDesc = {
  ratio_min: { required: true, type: 'number', extend: 'ratio', min: 66 },
  ratio_max: { required: true, type: 'number', extend: 'ratio', max: 88 },
  ratio_range: { required: true, type: 'number', extend: 'ratio', min: 66, max: 88 },
}

// 除于100是因为作为比例问题
const ratioSource = {
  ratio_min: 0.88,
  ratio_max: 0.88,
  ratio_range: 1,
}

const ratioValidator = new Schema(ratioDesc)

ratioValidator.validate(ratioSource, (error) => {
  console.log('ratio:', error)
})
