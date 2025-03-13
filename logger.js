const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let users = new Set();  // Use a Set to keep unique users

// Middleware to log errors
app.use(express.json());

// Serve the dashboard HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Endpoint to get total users
app.get("/users", (req, res) => {
    res.json({ total: users.size });
});

// Endpoint to log errors
app.post("/report", (req, res) => {
    const { error, timestamp, userId } = req.body;
    users.add(userId);  // Track the user

    const logEntry = `[${timestamp}] - ${error}\n`;
    fs.appendFileSync("error.log", logEntry);

    res.status(200).json({ message: "Error logged successfully" });
});

// Endpoint to get logged errors
app.get("/logs", (req, res) => {
    const logs = [];
    const logData = fs.readFileSync("error.log", "utf8").split("\n");

    logData.forEach((line) => {
        if (line.trim()) {
            const [timestamp, error] = line.split(" - ");
            logs.push({ timestamp: timestamp.replace("[", "").replace("]", ""), error });
        }
    });

    res.json({ logs });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
