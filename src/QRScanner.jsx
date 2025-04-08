import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';

function QRScanner({ onRedirectToScanner }) {
  const [data, setData] = useState('');
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [isScanning, setIsScanning] = useState(true); // State to control scanning
  const webcamRef = useRef(null);

  const capture = () => {
    if (!isScanning) return; // Stop scanning if popup is displayed

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setIsScanning(false); // Stop scanning immediately after detecting a QR code
          setData(code.data);
          validateHash(code.data); // Send hash to the backend
        } else {
          console.warn('No QR code detected.'); // Log warning but do not show popup
        }
      };
    }
  };

  const validateHash = async (hash) => {
    if (showPopup) return; // Prevent validation if the popup is already visible

    try {
      const response = await axios.post('http://localhost:3000/scan', { hash }); // Replace localhost with network IP
      const { message, name } = response.data; // Extract name from the response
      if (message === 'Ticket successfully scanned.') {
        setPopupMessage(`Welcome, ${name}!`); // Show welcome message with the name
      } else {
        setPopupMessage(message); // Show other messages (e.g., already scanned)
      }
      setShowPopup(true); // Show the popup
      setIsScanning(false); // Stop scanning
    } catch (err) {
      setPopupMessage('Invalid ticket.'); // Show invalid ticket message
      setShowPopup(true);
      setIsScanning(false); // Stop scanning
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false); // Hide the popup
    setData(''); // Clear scanned data
    setIsScanning(true); // Resume scanning
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isScanning) capture();
    }, 1000); // Scan every second
    return () => {
      clearInterval(interval);
    };
  }, [isScanning]); // Restart scanning when isScanning changes

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', color: '#333', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#2196F3' }}>QR Code Scanner</h1>
      {isScanning && (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          style={{
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            margin: '0 auto',
            border: '1px solid #ddd',
          }}
        />
      )}
      {/* {data && <p>Scanned Hash: {data}</p>} */}

      {/* Modal Popup */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              color: '#333',
              maxWidth: '90%',
            }}
          >
            <p>{popupMessage}</p>
            <button
              onClick={handlePopupClose}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRScanner;
