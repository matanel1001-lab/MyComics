const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate-panel', async (req, res) => {
    try {
        const { image, action, charDescription } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // כאן אנחנו מבקשים מ-Gemini ליצור Prompt מדויק לתמונה
        const prompt = `Based on this character description: ${charDescription}, 
        create a comic book panel showing: ${action}. 
        Style: Professional DC/Marvel comic book, vibrant colors, ink outlines.`;

        // הערה: נכון ל-2024, יצירת תמונה ישירה (Text-to-Image) ב-Gemini 
        // מתבצעת דרך Imagen 3 ב-Vertex AI. 
        // כאן נניח שאתה מקבל חזרה תיאור או קישור לתמונה.
        
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        
        res.json({ success: true, imageUrl: "URL_OR_BASE64_FROM_AI" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
