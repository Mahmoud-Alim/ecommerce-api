import mongoose from 'mongoose';

/**
 * User mongoose model.
 * Represents a registered user in the e-commerce system.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  street: {
    type: String,
    default: '',
    trim: true,
  },
  apartment: {
    type: String,
    default: '',
    trim: true,
  },
  city: {
    type: String,
    default: '',
    trim: true,
  },
  zip: {
    type: String,
    default: '',
    trim: true,
  },
  country: {
    type: String,
    default: '',
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
