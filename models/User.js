const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isValidated: { type: Boolean, default: false },
  validationCode: { type: String },
  company: {
    name: { type: String },
    address: { type: String },
    phone: { type: String }
  },
  profile: {
    fullName: { type: String },
    phone: { type: String },
    address: { type: String }
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
