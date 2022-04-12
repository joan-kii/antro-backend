import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Post = mongoose.model('Post', new Schema({
  body: {
    type: String,
    minLength: 3,
    maxLength:1000,
    required: true 
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ]
}));

export default Post;
