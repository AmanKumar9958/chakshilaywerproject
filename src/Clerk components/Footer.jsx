import React from 'react';

const Footer = ({ theme, language }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f5f5ef] border-t border-[#b69d7420] px-4 py-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="text-xs text-[#6b7280] text-center">
            © {currentYear} — All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;