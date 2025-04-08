import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import crypto from 'crypto';
import qrcode from 'qrcode';
import nodemailer from 'nodemailer';
import os from 'os';
import { getSheetData, appendHashToSheet, updateMailSentStatus, updateCheckStatus } from './googleSheets.js';

const app = express();
const port = 3000;

// Update CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://')) {
      callback(null, true); // Allow requests from any HTTP origin
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(bodyParser.json());

// Endpoint to generate a QR code from name and mail
app.post('/generate-qr', async (req, res) => {
  const { name, mail } = req.body;

  if (!name || !mail) {
    return res.status(400).json({ error: 'Name and mail are required.' });
  }

  try {
    const salt = "m#Wa{-uO>!mT.h`A)]]192e L.a@=P{a13S?FS:Q+;K54Z]I$PpNWXlZboD~ui/)"
    const hash = crypto.createHash('sha256').update(name + mail + salt).digest('hex');
    const qrCode = await qrcode.toDataURL(hash);
    res.json({ qrCode, hash });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to scan and validate QR codes
app.post('/scan', async (req, res) => {
  const { hash } = req.body;

  console.log('Received request at /scan endpoint');
  console.log(`Request body:`, req.body);

  try {
    const rows = await getSheetData();
    console.log('Fetched rows from Google Sheet:', rows);

    for (let i = 1; i < rows.length; i++) { // Skip the header row
      // const [timestamp, name, mail, email, hashQR, mailSent, checked] = rows[i];
      const [timestamp,	name, registration_number,	mail,	mobile_number,	year,	department,	section, transaction_id,	screenshot_of_the_payment, hashQR,	mailSent, checked] = rows[i];				
      console.log(`Checking row ${i + 1}: hashQR=${hashQR}, checked=${checked}`);

      if (hashQR === hash) { // Check if the hash matches
        if (checked === 'IN') { // If already marked as "IN"
          console.log(`Row ${i + 1}: Ticket already scanned.`);
          return res.json({ message: 'Ticket already scanned.' });
        } else {
          console.log(`Row ${i + 1}: Marking ticket as "IN".`);
          await updateCheckStatus(i); // Mark as "IN" in the checked column
          return res.json({ message: `Welcome, ${name}!`, name: name });
        }
      }
    }

    console.log('Hash not found in the sheet.');
    res.status(404).json({ message: 'Invalid QR Code.' });
  } catch (error) {
    console.error('Error scanning QR code:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'highways@svce.ac.in', // Replace with your email
    pass: 'hdofzllmonwainrp', // Replace with the provided app password
  },
});

// Endpoint to send mail
app.post('/send-mail', async (req, res) => {
  const { email, name, rowIndex } = req.body;

  if (!email || !name || rowIndex === undefined) {
    console.error('Missing email, name, or rowIndex in request body:', req.body);
    return res.status(400).json({ error: 'Email, name, and rowIndex are required.' });
  }

  try {
    console.log(`Preparing to send mail to ${email} for ${name}...`);

    // Generate the hash using the combination of name and mail
    const hash = crypto.createHash('sha256').update(name + email).digest('hex'); // Ensure consistent hash generation

    // Update the hash and mailSent status in the Google Sheet
    await appendHashToSheet(rowIndex, hash); // Append the hash to the "hashQR" column
    await updateMailSentStatus(rowIndex, 'SENT'); // Update the "mailSent" column to "SENT"

    // Generate the QR code as an image using the hash
    const qrCodeData = await qrcode.toDataURL(hash);
    const qrCodeBuffer = Buffer.from(qrCodeData.split(',')[1], 'base64');

    // Email content
    const mailOptions = {
      from: 'highways@svce.ac.in',
      to: email,
      subject: '🎉 Your Highways25 Ticket Awaits! 🎟️',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h1 style="color: #FF0000; text-align: center;">Welcome to Highways25!</h1>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We are thrilled to invite you to <strong>Highways25</strong>, a celebration of culture, art, and unforgettable experiences. Get ready to immerse yourself in a vibrant mix of performances, exhibitions, and interactive activities!</p>
          <p><strong>Event Details:</strong></p>
          <ul>
          <li><strong>Event Name:</strong> Highways25</li>
          <li><strong>Date:</strong> 24, 25 and 26 of April</li>
          <li><strong>Location:</strong> 
          <a href="https://maps.app.goo.gl/kB42ZSqQcndciTaF8" target="_blank">
          Sri Venkateswara College of Engineering, Sriperumbudhur
          </a>
          </li>
          <li><strong>Time: 8:30 am</strong> </li>
          </ul>
          <p>To make your entry seamless, we’ve generated a unique QR code just for you. Please present this QR code at the entrance:</p>
          <div style="text-align: center; margin: 20px 0;">
            <img src="cid:qrCode" alt="Highways25 Ticket QR Code" style="width: 200px; height: 200px; border: 1px solid #ddd;" />
          </div>
          <p>Don’t miss this opportunity to be part of an extraordinary event. We can’t wait to see you there!</p>
          <p>If you have any questions or need assistance, feel free to reach out to us.</p>
          <p style="text-align: center; font-size: 18px; color: #4CAF50;"><strong>See you at Highways25!</strong></p>
          <p>Warm regards,</p>
          <p><strong>The Highways25 Team</strong></p>
          <p><strong>Contact Us Through: <a href="mailto:highways@svce.ac.in">highways@svce.ac.in</a></strong></p>
        </div>
      `,
      attachments: [
        {
          filename: 'Highways25_Ticket.png',
          content: qrCodeBuffer,
          cid: 'qrCode',
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Mail sent successfully to ${email}:`, info.response);
    res.json({ message: `Mail sent to ${email}` });
  } catch (error) {
    console.error('Error sending mail:', error.message);
    res.status(500).json({ error: 'Failed to send mail.' });
  }
});

// Endpoint to fetch all users
app.get('/get-users', async (req, res) => {
  try {
    console.log('Fetching users from Google Sheets...');
    const rows = await getSheetData();
    console.log('Fetched rows:', rows);

    if (!rows || rows.length <= 1) {
      console.log('No user data found in the sheet.');
      return res.json([]); // Return an empty array if no data
    }

    const users = rows.slice(1).map((row, index) => ({
      rowIndex: index + 1, // Include the actual row index (1-based)
      name: row[1] || 'N/A', // Handle missing data
      mail: row[3] || 'N/A',
      transaction_id: row[8] || 'N/A',
      mailSent: row[11] || 'N/A',
    }));
    console.log('Processed users:', users);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users from Google Sheets:', error.message); // Log detailed error
    console.error('Stack Trace:', error.stack); // Log stack trace for debugging
    res.status(500).json({ error: 'Failed to fetch users from Google Sheets.', details: error.message }); // Include error details in the response
  }
});

// Get the host's IP address dynamically
const hostAddress = '127.0.0.1'; // Use localhost for the server

// Start the server
app.listen(port, hostAddress, () => {
  console.log(`Server running on http://${hostAddress}:${port}`);
});
