import { google } from 'googleapis';

const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: './server/credentials.json', // Ensure correct credentials path
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Correct spreadsheet ID
const spreadsheetId = '1RoNBDbs53X27tjr3AiozCx55R7-jF0bRFy98PgMfyZo'; 

export async function saveToGoogleSheets(name, registrationNumber, email, mobile, year, department, section, transactionId, screenshot, hash) {
  try {
    const client = await auth.getClient();
    
    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: 'SVCE!A:M', // Updated sheet name
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[new Date().toISOString(), name, registrationNumber, email, mobile, year, department, section, transactionId, screenshot, hash, 'Pending', '']],
      },
    });

    console.log(`Data saved for ${name}`);
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export async function getSheetData() {
  try {
    console.log('Authenticating with Google Sheets API...');
    const client = await auth.getClient();

    console.log('Fetching data from Google Sheet...');
    const range = 'SVCE!A:M'; // Updated sheet name
    console.log(`Fetching data from range: ${range}`);

    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });

    console.log('Fetched data:', response.data.values);
    return response.data.values;
  } catch (error) {
    console.error('Error in getSheetData:', error.message);
    throw error;
  }
}

export async function updateCheckStatus(rowIndex) {
  try {
    const client = await auth.getClient();

    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: `SVCE!M${rowIndex + 1}`, // "Checked" column (M)
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['IN']] },
    });

    console.log(`Check status updated for row ${rowIndex + 1}`);
  } catch (error) {
    console.error('Error updating check status:', error);
  }
}

export async function appendHashToSheet(rowIndex, hash) {
  try {
    const client = await auth.getClient();

    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: `SVCE!K${rowIndex + 1}`, // "HashQR" column (K)
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[hash]] },
    });

    console.log(`Hash updated for row ${rowIndex + 1}`);
  } catch (error) {
    console.error('Error updating hash:', error);
  }
}

export async function updateMailSentStatus(rowIndex, status) {
  try {
    const client = await auth.getClient();

    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: `SVCE!L${rowIndex + 1}`, // "MailSent" column (L)
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[status]] },
    });

    console.log(`MailSent status updated for row ${rowIndex + 1}`);
  } catch (error) {
    console.error('Error updating mail sent status:', error);
  }
}

console.log('Google Sheets connected.');
