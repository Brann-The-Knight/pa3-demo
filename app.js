//requires the first line to configure the bottom line
//require is for it to use it, pulling in the library
require("dotenv").config();
//config intializes package to be used later

//Creating your constant variable, 
// requiring libraries to be assigned to values
const express = require("express");
const twilio = require("twilio");
//--------
//setting the route for our web server
const app = express();

const TEMPERATURE_LIMIT = 30;

//tells express what will be doing w/ JSON
app.use(express.json());
//-------
//Sends your data; works for your credentials
//can be used for database credentials, keeping your database details safer
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
//-------

//We do we need an async & an away?
//Waiting to get ready to send the message by letting the number
//know to send the data and more out.
async function sendTextMessage() {
    //need to account for the latency to do the things
    const message = await client.messages.create({
        //allows us to send the pre-built messages
        body: "sms_internal_alerts",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER
    });

    console.log("SMS submitted:", message.sid);
}

//tries to send the message, and if it fails, 
// it will run the catch statement
app.get("/test-sms", async (req, res) => {
    try {
        await sendTextMessage();

        res.json({
            success: true,
            message: "SMS submitted successfully."
        });
    } catch (error) {
        console.error("SMS error:", error.message);

        res.status(500).json({
            success: false,
            message: "SMS submission failed."
        });
    }
});

const ALERT_COOLDOWN = 5 * 60 * 1000;

let lastAlertTime = 0;
let alertInProgress = false;


app.post("/sensor-data", async (req, res) => {
    const temperature = req.body.temperature;

    if (
        typeof temperature !== "number" ||
        !Number.isFinite(temperature)
    ) {
        return res.status(400).json({
            error: "Invalid temperature"
        });
    }

    console.log("Temperature:", temperature);

    const now = Date.now();

        if (
            temperature > TEMPERATURE_LIMIT &&
            !alertInProgress &&
            now - lastAlertTime >= ALERT_COOLDOWN
        ) {
            alertInProgress = true;

            try {
                await sendTextMessage();
                lastAlertTime = Date.now();
            } catch (error) {
                console.error("SMS error:", error.message);
            } finally {
                alertInProgress = false;
            }
        }

    res.json({
        success: true,
        temperature: temperature
    });
});

//sets the port to listen at 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});