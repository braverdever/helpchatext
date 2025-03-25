require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/modify', async (req, res) => {
    console.log("123");
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a professional text modifier. Your task is to make the given text more professional, formal, and well-structured while maintaining its original meaning. Fix grammar, punctuation, and formatting issues. Keep the tone professional but friendly."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0
        });

        const modifiedText = completion.choices[0].message.content.trim();
        res.json({ modifiedText });
    } catch (error) {
        console.error('Error modifying chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 