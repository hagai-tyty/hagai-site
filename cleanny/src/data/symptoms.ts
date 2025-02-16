import { Symptom, Specialist } from '../types';

export const symptoms: Symptom[] = [
  {
    id: 'pain_location',
    question: 'איפה אתה מרגיש כאב?',
    options: ['ראש', 'בטן', 'גב', 'חזה', 'גפיים', 'אחר'],
  },
  {
    id: 'pain_duration',
    question: 'כמה זמן אתה סובל מהכאב?',
    options: ['פחות מיום', 'מספר ימים', 'שבוע', 'חודש ומעלה'],
  },
  {
    id: 'pain_intensity',
    question: 'מה עוצמת הכאב? (1-10)',
    options: ['1-3 (קל)', '4-6 (בינוני)', '7-10 (חזק)'],
  },
];

export const specialists: Specialist[] = [
  {
    name: 'רופא משפחה',
    description: 'לבדיקה ראשונית והפניה לרופא מומחה במידת הצורך',
    icon: 'stethoscope',
  },
  {
    name: 'רופא פנימי',
    description: 'לבעיות רפואיות מורכבות ומחלות כרוניות',
    icon: 'activity',
  },
  {
    name: 'אורתופד',
    description: 'לבעיות במערכת השלד והשרירים',
    icon: 'bone',
  },
  {
    name: 'נוירולוג',
    description: 'לבעיות במערכת העצבים וכאבי ראש',
    icon: 'brain',
  },
];