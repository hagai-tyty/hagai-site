import React from 'react';
import { MessageCircle } from 'lucide-react';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Chat } from './components/Chat';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-blue-500 ml-2" />
          <h1 className="text-2xl font-bold text-gray-900">מערכת הכוונה רפואית</h1>
        </div>
        <EmergencyBanner />
      </header>

      <main className="max-w-3xl mx-auto">
        <Chat />
      </main>

      <footer className="max-w-2xl mx-auto mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} כללית - מערכת הכוונה רפואית</p>
        <p className="mt-1">
          מערכת זו נועדה לסיוע ראשוני בלבד ואינה מחליפה ייעוץ רפואי מקצועי
        </p>
      </footer>
    </div>
  );
}

export default App;