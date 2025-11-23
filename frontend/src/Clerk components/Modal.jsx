import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, content, theme }) => {
  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay with enhanced animation */}
      <div
        className="fixed inset-0 transition-opacity duration-300 ease-out"
        style={{
          backgroundColor: isOpen ? 'rgba(31, 40, 57, 0.85)' : 'transparent',
          backdropFilter: 'blur(6px)'
        }}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal container with enhanced animations */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className={`relative bg-[#f5f5ef] dark:bg-[#1f2839] rounded-xl shadow-2xl transform transition-all duration-300 ease-out ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          } ${
            content.size === 'large' ? 'max-w-4xl w-full' : 
            content.size === 'medium' ? 'max-w-2xl w-full' : 
            'max-w-lg w-full'
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(31, 40, 57, 0.25), 0 0 30px rgba(182, 157, 116, 0.15)',
            border: '1px solid rgba(182, 157, 116, 0.2)'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Golden accent border top */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
            style={{
              background: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)'
            }}
          ></div>

          {/* Header with enhanced styling */}
          {content.title && (
            <div 
              className="px-6 py-4 border-b"
              style={{
                borderColor: 'rgba(182, 157, 116, 0.2)',
                background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.03), rgba(182, 157, 116, 0.01))'
              }}
            >
              <div className="flex items-center justify-between">
                <h3 
                  className="text-xl font-semibold"
                  style={{ color: '#1f2839' }}
                  id="modal-headline"
                >
                  {content.title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    color: '#6b7280',
                    backgroundColor: 'rgba(182, 157, 116, 0.08)',
                    focusRingColor: '#b69d74'
                  }}
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Body with enhanced padding and styling */}
          <div 
            className="px-6 py-5"
            style={{ color: '#1f2839' }}
          >
            {content.body}
          </div>

          {/* Footer with enhanced styling */}
          {content.footer && (
            <div 
              className="px-6 py-4 border-t"
              style={{
                borderColor: 'rgba(182, 157, 116, 0.2)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03))'
              }}
            >
              {content.footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;