const express = require("express");

const app = express();

app.use(express.json());

// Open BHARGAV AI website
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/bhargav-ai.html");
});

// Ask Gemini
app.post("/ask", async (req, res) => {
    const question = req.body.question;

    if (!question) {
        return res.status(400).json({
            answer: "Please enter a question."
        });
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: question
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("Gemini response:", JSON.stringify(data));

        if (!response.ok) {
            return res.status(500).json({
                answer: "Gemini error: " +
                    (data.error?.message || "Unknown error")
            });
        }

        const answer =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Gemini did not return an answer.";

        res.json({
            answer: answer
        });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            answer: "Sorry, BHARGAV AI could not connect to Gemini."
        });
    }
});

// Render provides the PORT automatically
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`BHARGAV AI is running on port ${PORT}`);
});
