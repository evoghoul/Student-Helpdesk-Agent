import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Send } from 'lucide-react';
import { Club } from '@/data/clubs';

interface AncSectionProps {
  club: Club;
}

export function AncSection({ club }: AncSectionProps) {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    
    // In a real app, this would POST to a secure backend endpoint
    console.log("Complaint registered securely:", complaintText);
    
    setSubmitted(true);
    setComplaintText('');
    setTimeout(() => {
      setShowComplaintForm(false);
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <ShieldCheck className="w-8 h-8 text-rose-600" />
        <h2 className="text-2xl font-bold text-rose-900">{club.name}</h2>
      </div>
      
      <div className="bg-white p-5 rounded-lg border border-rose-100 mb-6">
        <h3 className="text-lg font-bold text-rose-800 mb-2 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Zero Tolerance Policy
        </h3>
        <p className="text-rose-700 leading-relaxed">
          {club.description} The state university strictly prohibits any form of ragging. 
          Consequences of ragging include immediate suspension, rustication from the university, 
          cancellation of admission, and lodging of an FIR with local police. 
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Key Contacts:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {club.members.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col">
              <span className="font-medium text-gray-900">{member.name}</span>
              <span className="text-sm font-semibold text-rose-600 mb-1">{member.role}</span>
              <span className="text-sm text-gray-500">{member.details}</span>
            </div>
          ))}
        </div>
      </div>

      {!showComplaintForm ? (
        <div className="bg-white p-5 rounded-lg border border-rose-100 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900">Have you been ragged?</h4>
            <p className="text-sm text-gray-500 mt-1">
              Your identity will be kept strictly confidential. No middleman involved.
            </p>
          </div>
          <button 
            onClick={() => setShowComplaintForm(true)}
            className="mt-4 sm:mt-0 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            Complain Here
          </button>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-lg border border-rose-200 shadow-sm transition-all duration-300">
          {submitted ? (
            <div className="text-center py-8">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Complaint Registered Successfully</h4>
              <p className="text-gray-600">
                Your incident has been securely recorded. The Nodal Officer has been notified. 
                Your secure Tracking ID is: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">ANC-{Math.floor(Math.random() * 10000)}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-rose-500 mr-2" />
                Register Confidential Complaint
              </h4>
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Please describe the incident in detail (location, time, persons involved if known)..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-shadow min-h-[120px] resize-y mb-4"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Securely
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
