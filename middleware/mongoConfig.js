import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoDBOn = async () => {
  return mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => console.log('Connected to MongoDB!'))
      .catch((err) => console.log('Not connected to MongoDb!', err));
};

const mongoDBOff = async () => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close();
  });
};

export { mongoDBOn, mongoDBOff };
