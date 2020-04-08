import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Option = new Schema({
  optionType: {
    type: String,
    enum: ["select", "check"]
  },
  name: {
    type: String,
    required: true
  },
  optionId: String,
  selectOptions: [{
    name: {
      type: String,
      required: true
    },
    optionId: {
      type: String,
      required: true
    }
  }]
});

// referenceId 0 was not added at some point
const Item = new Schema({
  referenceId: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  sectionId: String,
  price: Number,
  rank: Number,
  available: {
    type: Boolean,
    default: true
  },
  options: [Option]
});

const Section = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  rank: Number,
  items: {
    type: [Item],
    default: []
  }
});

const Menu = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  sections: {
    type: [Section],
    default: []
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('menu', Menu);