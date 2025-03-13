
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Error logs storage
const logFile = path.join(__dirname, "error_logs.json");

// Helper to save logs
function saveLog(error, timestamp, userId) {
    const logEntry = { error, timestamp, userId };
    let logs = [];

    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
    }
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

// Endpoint to receive error logs
app.post("/report", (req, res) => {
    const { error, timestamp, userId } = req.body;
    saveLog(error, timestamp, userId);
    res.status(200).send("Error logged successfully");
});

// Endpoint to get logs
app.get("/logs", (req, res) => {
    if (!fs.existsSync(logFile)) return res.json({ logs: [] });
    const logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
    res.json({ logs });
});

// Endpoint to get total users and user count
app.get("/users", (req, res) => {
    if (!fs.existsSync(logFile)) return res.json({ total: 0 });
    const logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
    const uniqueUsers = new Set(logs.map(log => log.userId));
    res.json({ total: uniqueUsers.size });
});

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Logging server running on http://localhost:${PORT}`);
});
