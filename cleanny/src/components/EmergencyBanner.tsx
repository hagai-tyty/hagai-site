import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex items-center">
        <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
        <div>
          <h3 className="text-red-800 font-semibold text-lg">במקרה חירום</h3>
          <p className="text-red-700">
            אם אתה חווה כאבים חזקים בחזה, קשיי נשימה, או מצב חירום אחר, 
            התקשר מיד למד"א
          </p>
          <div className="mt-2 flex items-center">
            <PhoneCall className="h-5 w-5 text-red-500 mr-2" />
            <a href="tel:101" className="text-red-700 font-bold text-lg">
              101
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};