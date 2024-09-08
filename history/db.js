import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const db = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "root",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "history"
})

export default db;