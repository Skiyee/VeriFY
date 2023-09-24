import Schema from './schema'

const descriptor = {
  name: {
    type: 'array',
    required: true,
    fields: {
      0: { required: true, type: 'string' },
    },
  },
}
const validator = new Schema(descriptor)

validator.validate({ name: [1] }, (error) => {
  console.log(error)
})
