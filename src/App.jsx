import React, { useState } from 'react';
import QRGenerator from './QRGenerator';
import QRScanner from './QRScanner';
import Admin from './Admin'; // Import the Admin component

function App() {
  const [view, setView] = useState('generator'); // State to toggle between views

  const handleRedirectToScanner = () => {
    setView('scanner'); // Set the view to scanner
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', color: '#333', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <nav
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          borderBottom: '2px solid #ddd',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button
          onClick={() => setView('generator')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            flex: '1 1 auto',
            maxWidth: '200px',
          }}
        >
          QR Generator
        </button>
        <button
          onClick={() => setView('scanner')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            flex: '1 1 auto',
            maxWidth: '200px',
          }}
        >
          QR Scanner
        </button>
        <button
          onClick={() => setView('admin')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            flex: '1 1 auto',
            maxWidth: '200px',
          }}
        >
          Admin Panel
        </button>
      </nav>
      <div
        style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {view === 'generator' && <QRGenerator />}
        {view === 'scanner' && <QRScanner onRedirectToScanner={handleRedirectToScanner} />}
        {view === 'admin' && <Admin />}
      </div>
    </div>
  );
}

export default App;
