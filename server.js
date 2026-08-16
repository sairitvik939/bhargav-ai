const express = require("express");

const app = express();

app.use(express.json());

// Open BHARGAV AI website
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/bhargav-ai.html");
});

// Ask Gemini using the Interactions API
app.post("/ask", async (req, res) => {
    const question = req.body.question;

    if (!question) {
        return res.status(400).json({
            answer: "Please enter a question."
        });
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },

                body: JSON.stringify({
                    model: "gemini-3.6-flash",
                    input: question
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

        let answer = data.output_text;

        if (!answer && data.steps) {
            for (const step of data.steps) {
                if (step.type === "model_output" && step.content) {
                    for (const item of step.content) {
                        if (item.type === "text") {
                            answer = item.text;
                            break;
                        }
                    }
                }

                if (answer) {
                    break;
                }
            }
        }

        answer = answer || "Gemini did not return an answer.";

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
