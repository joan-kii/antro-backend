import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String, 
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userSince: {
    type: Date,
    immutable: true,
    default: Date.now
  },
  bio: {
    type: String,
    default: 'Hi there!',
    required: false
  },
  profilePicture: {
    type: String,
    required: true
  },
  friends: [
    {
      friendsSince: {
        type: Date,
        immutable: true,
        default: Date.now
      },
      friend: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ],
  friendshipRequests: [
    {
      userRequest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    }
  ]
});

const User = mongoose.model('User', UserSchema);

export default User;
