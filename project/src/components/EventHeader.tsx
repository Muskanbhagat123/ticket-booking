import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EventHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-6">
        <Calendar className="w-10 h-10 text-white" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Virtual Tech Summit 2025
      </h1>
      
      <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
        Join industry leaders and innovators for an exclusive virtual event featuring cutting-edge technology insights and networking opportunities.
      </p>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span className="font-medium">July 25, 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <span className="font-medium">6:00 PM IST</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-purple-500" />
          <span className="font-medium">Virtual Event</span>
        </div>
      </div>
    </div>
  );
}