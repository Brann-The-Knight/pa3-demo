//should require the .dotenv file to access database
// require("dotenv").config();

// const express = require("express");
// const mysql = require("mysql2/promise");
import { sendTextMessage } from './app.js';

import 'dotenv/config';

import express from 'express';
import mysql from 'mysql2/promise';

const app = express();



const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: '-07:00'
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

//POST route for sending to the database.
app.post("/api/sensor", async (req, res) => {
console.log("POST ROUTE WAS REACHED");

    try {
       
        const { usValue, inUse, lightValue, inRoom } = req.body;

        await db.execute(
            "INSERT INTO usage_sensor (usValue, inUse, lightValue, inRoom) VALUES (?, ?, ?, ?)",
            [usValue, inUse, lightValue, inRoom]
        );

        console.log("Sensor data received:", 
            usValue, inUse, lightValue, inRoom);
        
            if (Number(usValue) > 75) {
            try {
                await sendTextMessage();
                console.log("SMS alert sent: ultrasonic value is too high.");
            } catch (error) {
                console.error("SMS alert failed:", error.message);
            }
            }

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

//POST route for twilio
app.post('/api/send-sms', async (req, res) => {
    try {
        await sendTextMessage();

        return res.status(200).json({
            success: true,
            message: "SMS sent successfully."
        });

    } catch (error) {
        console.error("SMS error:", error.message);

        return res.status(500).json({
            success: false,
            message: "SMS sending failed."
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
