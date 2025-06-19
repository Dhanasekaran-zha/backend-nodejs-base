import { Schema, model } from 'mongoose';

const hubSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Hub name is required'],
    maxlength: [20, 'Hub name must be less than 20 characters'],
    unique: [true, 'Hub name must be unique'],
  },
  code: {
    type: String,
    required: [true, 'Hub code is required'],
    maxLength: [6, 'Hub code must be less than 6 characters'],
    unique: [true, 'Hub code must be unique'],
  },
  isActive: {
    type: Boolean,
    required: [true, 'isActive  is required'],
    default: true,
  },
});
export default model('Hub', hubSchema);
