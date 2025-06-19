import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxLength: [20, 'Username must be less than 20 characters'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxLength: [50, 'Email must be less than 50 characters'],
      unique: [true, 'Email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [20, 'FirstName must be less than 20 characters'],
    },
    lastName: {
      type: String,
      maxLength: [20, 'LastName must be less than 20 characters'],
    },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default model('User', userSchema);
