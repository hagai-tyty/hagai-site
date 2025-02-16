import React from 'react';
import { useTriageStore } from '../store';
import { specialists } from '../data/symptoms';
import { Stethoscope, Activity, Bone, Brain } from 'lucide-react';

const iconMap = {
  stethoscope: Stethoscope,
  activity: Activity,
  bone: Bone,
  brain: Brain,
};

export const Results: React.FC = () => {
  const { answers, resetAnswers } = useTriageStore();
  
  // This is a placeholder logic that will be replaced with actual AI recommendations
  const recommendedSpecialist = specialists[0];
  const Icon = iconMap[recommendedSpecialist.icon as keyof typeof iconMap];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        המלצת המערכת
      </h2>
      
      <div className="text-center mb-8">
        <Icon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
        <h3 className="text-xl font-semibold mb-2">{recommendedSpecialist.name}</h3>
        <p className="text-gray-600">{recommendedSpecialist.description}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          חשוב לזכור: המלצה זו היא ראשונית בלבד ואינה מחליפה ייעוץ רפואי מקצועי.
          מומלץ להתייעץ עם רופא המשפחה שלך לקבלת הערכה מקיפה.
        </p>
      </div>

      <button
        onClick={resetAnswers}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
      >
        התחל מחדש
      </button>
    </div>
  );
};