import pkg from "pg"

const { Pool } = pkg

import dotenv from 'dotenv';

dotenv.config();



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Supabase
  },
});

pool.connect()
.then(() => console.log("connected to SUPABASE"))
.catch((err) => {console.error("connection error", err)})

export default pool;