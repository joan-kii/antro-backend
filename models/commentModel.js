import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Comment = mongoose.model('Comment', new Schema({
  body: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}));

export default Comment;
