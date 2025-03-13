const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Endpoint to receive error logs
app.post("/report", (req, res) => {
    const { error, timestamp } = req.body;

    // Log the error to a file
    const logMessage = `[${timestamp}] - ${error}\n`;
    fs.appendFile("error_logs.txt", logMessage, (err) => {
        if (err) console.error("Failed to save log:", err);
    });

    res.status(200).send("Error logged successfully");
});

app.listen(PORT, () => {
    console.log(`Logging server running on port ${PORT}`);
});
