//requires the first line to configure the bottom line
//require is for it to use it, pulling in the library
// require("dotenv").config();
import 'dotenv/config';
//config intializes package to be used later

//Creating your constant variable, 
// requiring libraries to be assigned to values

// const express = require("express");

// const twilio = require("twilio");
import twilio from 'twilio';
//--------
//setting the route for our web server
// const app = express();


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
async function sendTextMessage(to, message) {
    //need to account for the latency to do the things
    const message = await client.messages.create({
        //allows us to send the pre-built messages
        body: "sms_internal_alerts",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER
    });


    console.log("SMS submitted:", message.sid);
    return result;
}

export { sendTextMessage };