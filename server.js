import dotenv from "dotenv"
import express from "express"
import { MongoClient } from "mongodb";


dotenv.config()


const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(process.env.DATABASE_URI);

let usersCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('Fitlog'); 
    usersCollection = db.collection('Users');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('connection error', err);
  }
}

connectDB();

app.get('/', async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
