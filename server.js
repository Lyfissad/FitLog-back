import pool from "./config/db.js"
import dotenv from "dotenv"
import express, { json } from "express"



dotenv.config()


const app = express()

const PORT = process.env.PORT

app.use(express.json())



app.get("/",(req, res) => {
    res.send("API is working");
})


app.get("/users", async (req, res) => {
    try{
        const results = await pool.query("SELECT * FROM users")
        res.json(results.rows)
    }
    catch(err){
        console.error("An error occured")
        res.status(500).send("Server not working bitch")
    }
})

app.get('/dbtest', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ DB Error:', err);
    res.status(500).send('Database not connected');
  }
});


app.listen(PORT, () => {
    console.log("Server running on port 5000")
})