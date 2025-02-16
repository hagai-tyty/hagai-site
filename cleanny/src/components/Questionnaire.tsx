import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTriageStore } from '../store';
import { symptoms } from '../data/symptoms';

export const Questionnaire: React.FC = () => {
  const { currentSymptom, answers, setAnswer } = useTriageStore();
  const currentQuestion = symptoms[currentSymptom];

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-right">
        {currentQuestion.question}
      </h2>
      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => setAnswer(currentQuestion.id, option)}
            className="w-full text-right p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-between"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
            <span>{option}</span>
            <ChevronRight className="h-5 w-5 text-gray-400 opacity-0" />
          </button>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-500 text-center">
        שאלה {currentSymptom + 1} מתוך {symptoms.length}
      </div>
    </div>
  );
};