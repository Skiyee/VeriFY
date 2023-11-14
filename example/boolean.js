import Schema from '../dist/index.cjs'

const desc = {
  boolean: { required: true, type: 'boolean' },
}

const source = {
  boolean: true,
}

const validator = new Schema(desc)

validator.validate(source, (error) => {
  console.log(error)
})
