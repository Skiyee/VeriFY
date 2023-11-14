import Schema from '../dist/index.cjs'

// 普通类型
const desc = {
  enum: { required: true, type: 'enum', enums: ['Skiyee', 'VeriFy'] },
}

const source = {
  enum: 'Skiyee',
}

const validator = new Schema(desc)

validator.validate(source, (error) => {
  console.log('enum:', error)
})

// 数组类型
const arrayEnumDesc = {
  array_enum: { required: true, type: 'enum', enums: ['Skiyee', 'VeriFy', '319619193@qq.com'] },
}

const arrayEnumSource = {
  array_enum: ['Skiyee', 'VeriFy'],
}

const arrayEnumValidator = new Schema(arrayEnumDesc)

arrayEnumValidator.validate(arrayEnumSource, (error) => {
  console.log('arrayEnum:', error)
})
