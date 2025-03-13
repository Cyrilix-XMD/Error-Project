const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

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

// Endpoint to view logs on the web
app.get("/logs", (req, res) => {
    fs.readFile("error_logs.txt", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading log file.");
        }

        // Render logs as HTML
        const formattedLogs = data.replace(/\n/g, "<br>");
        res.send(`
            <html>
            <head>
                <title>Error Logs</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Logged Errors</h1>
                <pre>${formattedLogs || "No logs available"}</pre>
            </body>
            </html>
        `);
    });
});

// Home page
app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Logging Server</title>
        </head>
        <body>
            <h1>Welcome to the Logging Server</h1>
            <p>View error logs: <a href="/logs">Click here</a></p>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Logging server running on http://localhost:${PORT}`);
});
