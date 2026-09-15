const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { speakerTitle, message } = req.body;
    
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are Alfred Pennyworth, butler of Wayne Manor. Speak with refined British charm. Address the user as ${speakerTitle}. Keep responses under 2 sentences.`
                },
                { role: "user", content: message }
            ]
        }, {
            headers: { 
                'Authorization': `Bearer ${process.env.GROQ_API_KEY.trim()}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Groq Error:", error.response ? error.response.data : error.message);
        res.json({ reply: "My apologies, sir, but my train of thought was interrupted." });
    }
});

app.listen(process.env.PORT || 3000);
