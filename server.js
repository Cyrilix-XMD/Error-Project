
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const logFile = "error_logs.txt";

// Middleware to parse JSON
app.use(bodyParser.json());

// Endpoint to receive error logs
app.post("/report", (req, res) => {
    const { error, timestamp, userId } = req.body;

    // Log the error as a JSON object
    const logEntry = { timestamp, error, userId };
    let logs = [];

    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
    }

    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    res.status(200).send("Error logged successfully");
});

// Endpoint to get logs
app.get("/logs", (req, res) => {
    let logs = [];
    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
    }

    // Sort logs by timestamp (latest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Count unique users
    const uniqueUsers = new Set(logs.map(log => log.userId));

    res.json({ logs, total: uniqueUsers.size });
});

// Serve the HTML dashboard
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dashboard.html");
});

app.listen(PORT, () => {
    console.log(`Logging server running on http://localhost:${PORT}`);
});
