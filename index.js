//should require the .dotenv file to access database
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();



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


app.post("/api/sensor", async (req, res) => {
console.log("POST ROUTE WAS REACHED");

    try {
       
        const { value, isCovered } = req.body;

        await db.execute(
            "INSERT INTO PhotoResistance (value, `isCovered?`) VALUES (?, ?)",
            [value, isCovered? ? 1 : 0]
        );

        console.log("Sensor data received:", value, isCovered);

        res.json({
            message: "Sensor data has been saved"
        });
    } catch (error) {
        console.error("Database insert has failed:", error);
        res.status(500).json({
            message: "Database error"
        });
    }
});

// app.post("/api/sensor", (req, res) => {
//     console.log(req.body);
//     res.json({
//         message: "Sensor data received"
//     });
// });

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
