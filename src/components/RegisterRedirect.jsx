import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Open the register modal via global event the Navbar listens for
    window.dispatchEvent(new CustomEvent('open-register-modal'));

    // If navbar/modal doesn't exist for some reason, navigate back to home after a short delay
    const t = setTimeout(() => {
      navigate('/');
    }, 1200);

    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <h2 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>Opening registration...</h2>
        <p style={{color: '#6b7280'}}>If nothing happens, please use the Register button in the navbar.</p>
      </div>
    </div>
  );
};

export default RegisterRedirect;
