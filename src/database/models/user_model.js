import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
  firebaseId: {
    type: String,
    required: true
  },
  email: {
    unique: true,
    type: String
  },
  name: {
    type: String,
    index: true
  },
  description: {
    type: String,
    index: true
  },
  street: String,
  zipCode: Number,
  country: String,
  state: String,
  longitude: Number,
  latitude: Number
  // could add reference to menus to load a users menus faster
  // TODO for later!
}, { timestamps: true });

User.index({ name: "text" });

export default mongoose.model('user', User);