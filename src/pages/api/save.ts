import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { institucion, correo, rol, respuestas } = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // ID de tu Excel extraído de la URL que me pasaste
    const spreadsheetId = '15oJuvgGQIFE4cbGR3VU_zZ6sEco4gKDlUa6j0aoJj_g';

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Hoja 1!A:P',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
          institucion,
          correo,
          rol,
          ...respuestas
        ]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('ERROR EN GOOGLE SHEETS:', error);
    return res.status(500).json({ error: error.message });
  }
}