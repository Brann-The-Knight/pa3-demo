//should require the .dotenv file to access database
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

async function testDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("MySQL connection successful");

        await connection.end();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
}

testDatabase();


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.getConnection()
    .then(connection => {
        console.log("Connected to MySQL database!");
        connection.release();
    })
    .catch(error => {
        console.error("Database connection failed:", error);
    });

app.use(express.json());

app.post("/api/sensor", (req, res) => {
    console.log(req.body);
    res.json({
        message: "Sensor data received"
    });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
