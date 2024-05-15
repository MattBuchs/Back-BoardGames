import mysql from "mysql2";
import logger from "./logger.js";

const { createConnection } = mysql;

const client = createConnection({
    host: "localhost",
    user: "root",
    password: "/9oVerLord9/",
    database: "boardgames",
});

client.connect((error) => {
    if (error) {
        logger.log("Error connecting to database", error);
    } else {
        logger.log("mysql successfully connected to the database");
    }
});

export default client;
