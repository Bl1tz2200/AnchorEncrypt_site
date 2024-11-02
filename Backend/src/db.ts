import {Pool} from "pg"
import { config } from 'dotenv';
config()

// Creates db class from env vars

export const pool = new Pool({  
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});


