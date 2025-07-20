import React from 'react';
import { CheckCircle, Mail, Calendar, Clock, Download, Share2 } from 'lucide-react';
import { TicketConfirmation } from '../types/booking';

interface ConfirmationPageProps {
  confirmation: TicketConfirmation;
  onStartOver: () => void;
}

export default function ConfirmationPage({ confirmation, onStartOver }: ConfirmationPageProps) {
  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert('Ticket download feature would be implemented here');
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Virtual Tech Summit 2025',
        text: 'I just booked my tickets for the Virtual Tech Summit 2025!',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h1>
        
        <p className="text-xl text-gray-600">
          Your tickets have been successfully booked. Get ready for an amazing experience!
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Virtual Tech Summit 2025</h2>
          <p className="opacity-90">Your Digital Ticket</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="font-mono font-medium">{confirmation.ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{confirmation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{confirmation.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets:</span>
                  <span className="font-medium">{confirmation.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-bold text-green-600">₹{confirmation.totalAmount}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>{confirmation.eventDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span>{confirmation.eventTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span>Check your email for access details</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Check your email for the confirmation and access details</li>
                <li>• Download the event app and join the community</li>
                <li>• Mark your calendar for July 25, 2025 at 6:00 PM IST</li>
                <li>• Prepare your questions for the Q&A sessions</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadTicket}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Ticket
              </button>
              
              <button
                onClick={handleShareEvent}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Event
              </button>
            </div>

            <button
              onClick={onStartOver}
              className="w-full mt-4 text-purple-600 hover:text-purple-700 py-2 text-sm font-medium transition-colors"
            >
              Book More Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}