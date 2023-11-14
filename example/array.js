import Schema from '../dist/index.cjs'

// 普通类型
const desc = {
  spec_type: {
    required: true,
    type: 'array',
    allField: { required: true, type: 'string' },
  },
}

const source = {
  spec_type: ['single', 1],
}

const validator = new Schema(desc)

validator.validate(source, (error) => {
  console.log('array: ', error)
})

// Array<object>类型
const objectOfArrayDesc = {
  sku_list: {
    require: true,
    type: 'array',
    allField: {
      require: true,
      type: 'object',
      fields: {
        goods_id: { require: true, type: 'string' },
      },
    },
  },
}

const objectOfArraySource = {
  sku_list: [
    {
      goods_id: '001',
    },
    {
      goods_id: 200,
    },
  ],
}

const objectOfArrayValidator = new Schema(objectOfArrayDesc)

objectOfArrayValidator.validate(objectOfArraySource, (error) => {
  console.log('objectOfArray: ', error)
})
