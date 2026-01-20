const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
  label: String,
  name: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  country: String,
  zip: String,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpires: Date,
    resetToken: String,
    resetExpires: Date,
    avatar: {
      url: String,
      publicId: String
    },
    addresses: [addressSchema],
    isBlocked: { type: Boolean, default: false },
    refreshTokens: [String],
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referralCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('save', async function () {
  if (!this.isModified('referralCode') && !this.referralCode) {
    let code;
    let exists;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await mongoose.model('User').findOne({ referralCode: code });
    } while (exists);
    this.referralCode = code;
  }
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.verificationToken;
  delete obj.verificationExpires;
  delete obj.resetToken;
  delete obj.resetExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

