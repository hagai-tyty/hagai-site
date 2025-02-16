import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Allows frontend to call the backend

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from .env file
});

const SYSTEM_PROMPT = `אתה עוזר רפואי של קופת חולים כללית. תפקידך הוא לעזור למטופלים להבין לאיזה רופא עליהם לפנות בהתאם לתסמינים שלהם.

כללים חשובים:
1. תמיד ענה בעברית
2. במקרה של מצב חירום, הנחה את המטופל להתקשר למד"א (101)
3. אל תאבחן מחלות - רק כוון לרופא המתאים
4. הדגש שההמלצות הן ראשוניות בלבד ואינן מחליפות ייעוץ רפואי
5. שאל שאלות נוספות אם צריך מידע נוסף להכוונה מדויקת

רופאים אפשריים להפניה:
- רופא משפחה
- רופא ילדים
- רופא פנימי
- קרדיולוג
- נוירולוג
- אורתופד
- רופא עור
- רופא עיניים
- רופא אף אוזן גרון
- גסטרואנטרולוג
- גניקולוג
- אורולוג
- פסיכיאטר`;

app.post('/chat', async (req, res) => {
  try {
    const { userMessage, messageHistory } = req.body;

    if (!userMessage || !messageHistory) {
      return res
        .status(400)
        .json({ error: 'Missing userMessage or messageHistory' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messageHistory,
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({
      response:
        response.choices[0]?.message?.content ||
        'מצטער, לא הצלחתי לעבד את הבקשה.',
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'מצטער, אירעה שגיאה בעיבוד הבקשה.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
