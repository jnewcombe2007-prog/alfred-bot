const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { speakerTitle, message } = req.body;
    
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are Alfred Pennyworth, butler of Wayne Manor. You are witty, polite, extremely intelligent, and speak with refined British charm. Address the user as ${speakerTitle}. Keep responses short (under 2 sentences) so it fits in a Roblox chat bubble.`
                },
                { role: "user", content: message }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
        });

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Groq Error:", error.response ? error.response.data : error.message);
        res.json({ reply: "My apologies, sir, but my train of thought was interrupted." });
    }
});

app.listen(process.env.PORT || 3000);
