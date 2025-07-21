import pkg from "pg"

const { Pool } = pkg

import dotenv from 'dotenv';

dotenv.config();



const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl:{
        rejectUnauthorized: false
    }
});

pool.connect()
.then(() => console.log("connected to SUPABASE"))
.catch((err) => {console.error("connection error", err)})

export default pool;