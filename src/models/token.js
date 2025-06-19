import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
  token: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

export default model('Token', tokenSchema);
