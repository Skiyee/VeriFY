import Schema from './schema'

const descriptor = {
  name: {
    type: 'string',
    required: true,
    validator: (rule, value, callback) => {
      if (value !== 'test')
        callback(new Error('不晓得'))

      else
        callback()
    },
  },
  list: {
    type: 'number',
    message: '21',
    validator: () => {
      return false
    },
  },
}
const validator = new Schema(descriptor)
validator.validate({ name: '123123123', list: '21' }, (error, field) => {
  console.log(error, field)
})
