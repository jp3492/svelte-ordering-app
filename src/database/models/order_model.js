import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Item = new Schema({
  referenceId: {
    type: String,
    required: true
  },
  note: String
});

const Order = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  target: {
    type: String,
    required: true
  },
  items: [Item],
  paid: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true })

export default mongoose.model('order', Order);