import React, { useState } from 'react';

const Help = () => {
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    gold: '#b69d74',
    gray: '#6b7280',
  };

  const faqs = [
    {
      question: 'How do I add a new case?',
      answer: 'Navigate to the Cases section and click on the "Add New Case" button. Fill in the required details and submit.'
    },
    {
      question: 'How can I check if a case is fake?',
      answer: 'Use the Fraud Detection feature from the navigation menu. Enter the case details to verify authenticity.'
    },
    {
      question: 'How do I send SMS notifications?',
      answer: 'Go to SMS Log section and click "Send SMS". Select recipients and compose your message.'
    },
    {
      question: 'How can I access offline mode?',
      answer: 'Enable offline mode from the settings. This allows you to work without an internet connection.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.navy }}>
            Help & Support
          </h1>
          <p className="text-lg" style={{ color: colors.gray }}>
            Find answers to common questions and get support
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div 
            className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
            style={{ borderTop: `3px solid ${colors.gold}` }}
          >
            <svg 
              className="w-12 h-12 mx-auto mb-4"
              fill="none" 
              stroke={colors.gold}
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
            <h3 className="font-semibold mb-2" style={{ color: colors.navy }}>Documentation</h3>
            <p className="text-sm" style={{ color: colors.gray }}>View user guides</p>
          </div>

          <div 
            className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
            style={{ borderTop: `3px solid ${colors.gold}` }}
          >
            <svg 
              className="w-12 h-12 mx-auto mb-4"
              fill="none" 
              stroke={colors.gold}
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <h3 className="font-semibold mb-2" style={{ color: colors.navy }}>Email Support</h3>
            <p className="text-sm" style={{ color: colors.gray }}>support@chakshi.com</p>
          </div>

          <div 
            className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
            style={{ borderTop: `3px solid ${colors.gold}` }}
          >
            <svg 
              className="w-12 h-12 mx-auto mb-4"
              fill="none" 
              stroke={colors.gold}
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
              />
            </svg>
            <h3 className="font-semibold mb-2" style={{ color: colors.navy }}>Phone Support</h3>
            <p className="text-sm" style={{ color: colors.gray }}>+91-1234567890</p>
          </div>
        </div>

        {/* FAQs */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-8"
          style={{ borderTop: `4px solid ${colors.gold}` }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.navy }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: colors.gold + '30' }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-opacity-50"
                  style={{ 
                    backgroundColor: expandedFaq === index ? colors.gold + '10' : 'transparent',
                    transition: 'all 0.3s'
                  }}
                >
                  <span className="font-semibold" style={{ color: colors.navy }}>
                    {faq.question}
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke={colors.gold}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div 
                    className="p-4 border-t"
                    style={{ 
                      borderColor: colors.gold + '30',
                      backgroundColor: colors.cream
                    }}
                  >
                    <p style={{ color: colors.gray }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
