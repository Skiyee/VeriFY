import Schema from '../dist/index.mjs'

const patternDesc = {
  test: { required: true, type: 'string', extend: 'pattern', pattern: '/^[a-z]+$/' },
}

const patternSource = {
  test: 123,
}

const patternValidator = new Schema(patternDesc)

patternValidator.validate(patternSource, (error) => {
  console.log(error)
})

const moneyDesc = {
  test: { required: true, type: 'number', extend: 'money', min: 0, max: 1000 },
}

const moneySource = {
  test: 200,
}

const moneyValidator = new Schema(moneyDesc)

moneyValidator.validate(moneySource, (error) => {
  console.log(error)
})

const enumStringDesc = {
  test: { required: true, type: 'enum', enums: ['one', 'two', 'three'] },
}

const enumStringSource = {
  test: '123',
}

const enumStringValidator = new Schema(enumStringDesc)

enumStringValidator.validate(enumStringSource, (error) => {
  console.log(error)
})

const enumArrayDesc = {
  test: { required: true, type: 'enum', enums: ['one', 'two', 'three'] },
}

const enumArraySource = {
  test: ['three', '123'],
}

const enumArrayValidator = new Schema(enumArrayDesc)

enumArrayValidator.validate(enumArraySource, (error) => {
  console.log(error)
})

const booleanDesc = {
  cool: { required: true, type: 'boolean', message: 'super cool' },
}

const booleanSource = {
  cool: true,
}

const booleanValidator = new Schema(booleanDesc)

booleanValidator.validate(booleanSource, (error) => {
  console.log(error)
})

const objectDesc = {
  class: {
    required: true,
    type: 'object',
    fields: {
      name: { required: true, type: 'string', message: '班级名称不能为空' },
      num: { require: true, type: 'number' },
      person: {
        required: true,
        type: 'object',
        fields: {
          xianMing: { require: true, type: 'string' },
          xianHong: { require: true, type: 'string' },
        },
      },
    },
  },
}

const objectSource = {
  class: {
    name: '',
    num: 49,
    person: {
      xianMing: '汪大东',
      xianHong: 'king',
    },
  },
}

const objectValidator = new Schema(objectDesc)

objectValidator.validate(objectSource, (error) => {
  console.log(error)
})

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
  console.log(error)
})
