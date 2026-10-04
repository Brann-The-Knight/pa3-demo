//should require the .dotenv file to access database
require("dotenv").config();

const express = require("express");

const app = express();

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
