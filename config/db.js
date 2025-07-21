const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://<user>:<password>@anime-hub.vwvmjos.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(process.env.DATABASE_URI);

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('Fitlog');
    const users = db.collection('Users');
    console.log('Connected to MongoDB');
    
    const allUsers = await users.find({}).toArray();
    console.log(allUsers);
  } catch (err) {
    console.error('connection error', err);
  }
}

connectDB();
