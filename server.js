const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    fs.readFile("bhargav-ai.html", (err, data) => {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.end("Error loading BHARGAV AI");
            return;
        }

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(data);
    });
});

server.listen(3000, "0.0.0.0", () => {
    console.log("BHARGAV AI is running at http://localhost:3000");
});