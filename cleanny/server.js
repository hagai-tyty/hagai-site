import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(express.static(join(__dirname, 'dist')));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
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

// Mock responses based on keywords
const mockResponses = {
  default: {
    response: 'אני ממליץ לפנות לרופא המשפחה שלך לבדיקה ראשונית. הוא יוכל להעריך את מצבך ולהפנות אותך לרופא מומחה במידת הצורך.',
    specialist: 'רופא משפחה'
  },
  ראש: {
    response: 'כאבי ראש יכולים לנבוע ממגוון סיבות. מומלץ להתחיל עם ביקור אצל רופא המשפחה, והוא ישקול הפניה לנוירולוג במידת הצורך. האם הכאבים מלווים בתסמינים נוספים?',
    specialist: 'נוירולוג'
  },
  בטן: {
    response: 'לבעיות בטן מתמשכות, התייעצות עם רופא המשפחה היא הצעד הראשון. הוא ישקול הפניה לגסטרואנטרולוג אם יש צורך. האם יש לך גם בחילות או הקאות?',
    specialist: 'גסטרואנטרולוג'
  },
  חזה: {
    response: 'כאבים בחזה דורשים התייחסות רצינית. אם הכאב חזק או פתאומי, יש לפנות מיד למיון. אחרת, קבע תור דחוף לרופא המשפחה שישקול הפניה לקרדיולוג.',
    specialist: 'קרדיולוג'
  },
  עור: {
    response: 'לבעיות עור, רופא המשפחה יכול לתת טיפול ראשוני או להפנות לרופא עור. האם יש לך גם גירוד או אדמומיות?',
    specialist: 'רופא עור'
  },
  עין: {
    response: 'לבעיות בעיניים, מומלץ לפנות לרופא עיניים. האם יש לך גם טשטוש ראייה או כאבים?',
    specialist: 'רופא עיניים'
  },
  גרון: {
    response: 'לבעיות גרון מתמשכות, רופא המשפחה יכול להפנות לרופא אף אוזן גרון. האם יש לך גם קשיי בליעה או צרידות?',
    specialist: 'רופא אף אוזן גרון'
  },
  רגל: {
    response: 'לכאבים בגפיים, רופא המשפחה יכול להפנות לאורתופד במידת הצורך. האם הכאב מופיע בעיקר בתנועה?',
    specialist: 'אורתופד'
  },
  חרדה: {
    response: 'במקרים של חרדה או מצוקה נפשית, רופא המשפחה יכול להפנות לפסיכיאטר או פסיכולוג. האם תרצה לספר עוד על מה שאתה מרגיש?',
    specialist: 'פסיכיאטר'
  }
};

function getMockResponse(message) {
  const lowercaseMessage = message.toLowerCase();
  
  // Check for emergency keywords first
  if (lowercaseMessage.includes('חירום') || lowercaseMessage.includes('דחוף')) {
    return {
      response: 'במקרה של כאבים חזקים או מצב חירום, אנא התקשר מיד למד"א בטלפון 101.',
      isEmergency: true
    };
  }

  // Check for symptoms in the message
  for (const [keyword, response] of Object.entries(mockResponses)) {
    if (lowercaseMessage.includes(keyword)) {
      return response;
    }
  }
  
  return mockResponses.default;
}

const ErrorTypes = {
  RATE_LIMIT: 'rate_limit',
  API_ERROR: 'api_error',
  VALIDATION: 'validation',
  SERVER: 'server_error',
  AUTH: 'auth_error'
};

const ErrorMessages = {
  [ErrorTypes.RATE_LIMIT]: 'המערכת עמוסה כרגע, עוברים למצב מענה אוטומטי.',
  [ErrorTypes.API_ERROR]: 'אירעה שגיאה בתקשורת עם השרת, עוברים למצב מענה אוטומטי.',
  [ErrorTypes.VALIDATION]: 'הבקשה אינה תקינה. אנא ודא שהזנת את כל הפרטים הנדרשים.',
  [ErrorTypes.SERVER]: 'אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.',
  [ErrorTypes.AUTH]: 'שגיאת אימות, עוברים למצב מענה אוטומטי.'
};

function handleOpenAIError(error) {
  console.error('OpenAI Error:', error);
  
  if (error.status === 429) {
    return {
      code: ErrorTypes.RATE_LIMIT,
      message: ErrorMessages[ErrorTypes.RATE_LIMIT]
    };
  }
  
  if (error.status === 401 || error.status === 403) {
    return {
      code: ErrorTypes.AUTH,
      message: ErrorMessages[ErrorTypes.AUTH]
    };
  }
  
  return {
    code: ErrorTypes.API_ERROR,
    message: ErrorMessages[ErrorTypes.API_ERROR]
  };
}

app.post('/chat', async (req, res) => {
  try {
    const { userMessage, messageHistory } = req.body;

    if (!userMessage || !messageHistory) {
      return res.status(400).json({
        error: ErrorMessages[ErrorTypes.VALIDATION],
        code: ErrorTypes.VALIDATION,
        details: 'חסרים פרטים בבקשה'
      });
    }

    try {
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
        response: response.choices[0]?.message?.content,
        source: 'ai'
      });
    } catch (openaiError) {
      const error = handleOpenAIError(openaiError);
      console.error('OpenAI API Error:', openaiError);
      
      // Use mock response when API fails
      const mockResponse = getMockResponse(userMessage);
      res.json({
        response: mockResponse.response,
        error: error.message,
        code: error.code,
        source: 'mock',
        specialist: mockResponse.specialist
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    const mockResponse = getMockResponse(userMessage);
    res.json({
      response: mockResponse.response,
      error: ErrorMessages[ErrorTypes.SERVER],
      code: ErrorTypes.SERVER,
      source: 'mock',
      specialist: mockResponse.specialist
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});