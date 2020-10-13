// TODO: move to Koios

import { Schema, model } from 'mongoose'

const purchaseSchema = new Schema({
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  closed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
})

export default model('Purchase', purchaseSchema)
