import pg from "pg";
import logger from "./logger.js";

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect((error) => {
    if (error) {
        logger.log("Error connecting to database", error);
    } else {
        logger.log("pg successfully connected to the database");
    }
});

export default client;
