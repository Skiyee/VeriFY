import Schema from '../dist/index.cjs'

const desc = {
  row: {
    required: true,
    type: 'object',
    fields: {
      item_one: { required: true, type: 'number' },
      item_two: { required: true, type: 'number' },
    },
  },
}

const source = {
  row: {
    item_one: 666,
    item_two: '888',
  },
}

const validator = new Schema(desc)

validator.validate(source, (error) => {
  console.log(error)
})
