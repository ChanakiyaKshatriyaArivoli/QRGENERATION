import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QRGenerator() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [error, setError] = useState(''); // State to store error messages

  useEffect(() => {
    // Dynamically load the custom form script
    const script = document.createElement('script');
    script.src = 'https://cdn.customgform.com/cgf.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script); // Cleanup script on component unmount
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setQRCode(''); // Clear previous QR code
    try {
      const response = await axios.post('http://localhost:3000/generate-qr', { name, mail: email }); // Use localhost for the backend
      setQRCode(response.data.qrCode); // Set the QR code from the response
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError('Failed to generate QR code. Please try again.'); // Set user-friendly error message
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1 style={{ marginBottom: '20px', color: '#4CAF50' }}>QR Code Generator</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: '15px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            color: '#333',
            borderRadius: '5px',
            width: '100%',
            maxWidth: '600px',
            fontSize: '16px',
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '15px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            color: '#333',
            borderRadius: '5px',
            width: '100%',
            maxWidth: '600px',
            fontSize: '16px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '15px 30px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          Generate QR Code
        </button>
      </form>
      {error && <p style={{ color: '#f44336' }}>{error}</p>}
      {qrCode && (
        <img
          src={qrCode}
          alt="QR Code"
          style={{
            marginTop: '20px',
            border: '1px solid #ddd',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      )}
      {/* <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#4CAF50' }}>Google Form</h2>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfdL7NWCMruYMKD2I76TsxhpfVFTNPohEUb7AyHBpIGav3dPg/viewform?usp=pp_url&entry.1035943949=mika&entry.460800904=sa@gmail.com&entry.115280107=84543082834&entry.565764829=372382784298&entry.1726176711=6767"
          title="Google Form"
          style={{
            width: '100%',
            maxWidth: '600px',
            height: '800px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginTop: '20px',
          }}
        ></iframe>
      </div> */}
    </div>
  );
}

export default QRGenerator;