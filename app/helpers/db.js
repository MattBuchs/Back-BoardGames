import mysql from "mysql2/promise";
import logger from "./logger.js";

const { createConnection } = mysql;

const client = await createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

try {
    await client.connect();
    logger.log("MySQL successfully connected to the database");
} catch (error) {
    logger.log("Error connecting to database", error);
}

export default client;
