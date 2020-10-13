// TODO: move to Koios
import { Schema, model } from 'mongoose'

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Original Artwork'
  },
  price: {
    type: Number,
    required: true,
    default: 1
  },
  artwork: {
    type: Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  },
  productImageUri: {
    type: String
  }
}, {
  timestamps: true
})

export default model('Product', productSchema)
