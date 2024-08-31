import mysql from "mysql2/promise";
import logger from "./logger.js";

const { createConnection } = mysql;

const client = await createConnection({
    host: "localhost",
    user: "root",
    password: "/9oVerLord9/",
    database: "boardgames",
});

try {
    await client.connect();
    logger.log("MySQL successfully connected to the database");
} catch (error) {
    logger.log("Error connecting to database", error);
}

export default client;
