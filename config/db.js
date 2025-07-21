import pkg from "pg"

const { Pool } = pkg

import dotenv from 'dotenv';

dotenv.config();



const pool = new Pool({
    connectionString: process.env.SUPABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});

pool.connect()
.then(() => console.log("connected to SUPABASE"))
.catch(() => {console.error("connection error")})

export default pool;