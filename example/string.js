import Schema from '../dist/index.cjs'

// 普通类型
const desc = {
  min: { required: true, type: 'string', min: 6 },
  max: { required: true, type: 'string', max: 8 },
  range: { required: true, type: 'string', min: 6, max: 18 },
  length: { required: true, type: 'string', len: 14 },
}

const source = {
  min: 'VeriFy',
  max: 'Skiyee',
  range: 'VeriFy: Skiyee',
  length: 'VeriFy: Skiyee',
}

const validator = new Schema(desc)

validator.validate(source, (error) => {
  console.log('string:', error)
})

// 拓展类型
const mobileDesc = {
  test: { required: true, type: 'string', extend: 'mobile' },
}

const mobileSource = {
  test: '18888888888',
}

const mobileValidator = new Schema(mobileDesc)

mobileValidator.validate(mobileSource, (error) => {
  console.log('mobile:', error)
})

const patternDesc = {
  test: { required: true, type: 'string', extend: 'pattern', pattern: /^([a-zA-Z])+$/ },
}

const patternSource = {
  test: 'Skiyee',
}

const patternValidator = new Schema(patternDesc)

patternValidator.validate(patternSource, (error) => {
  console.log('pattern:', error)
})
