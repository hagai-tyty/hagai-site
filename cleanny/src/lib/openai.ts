interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
  source?: 'ai' | 'mock';
  specialist?: string;
}

interface ChatResponse {
  response: string;
  error?: string;
  code?: string;
  source?: 'ai' | 'mock';
  specialist?: string;
}

export async function getChatResponse(
  userMessage: string,
  messageHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage, messageHistory }),
    });

    const data: ChatResponse = await response.json();
    
    if (data.error) {
      // If we have a mock response, use it with the error message
      if (data.source === 'mock') {
        return `${data.response}\n\n(${data.error})`;
      }
      return `שגיאה: ${data.error}`;
    }

    return data.response;
  } catch (error) {
    console.error('Network Error:', error);
    return 'שגיאת תקשורת: לא ניתן להתחבר לשרת. אנא בדוק את החיבור לאינטרנט ונסה שוב.';
  }
}