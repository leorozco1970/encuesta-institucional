import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo permitimos el método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // 1. Configuración de la clave privada (limpieza profunda)
    // Esto quita comillas extras y arregla los saltos de línea (\n)
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    const formattedKey = privateKey.replace(/\\n/g, '\n');

    // 2. Autenticación con Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: formattedKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 3. Obtener datos del formulario
    const { institucion, correo, rol, respuestas } = req.body;

    // 4. Guardar en el Excel (Usando el nombre exacto de tu hoja)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "'Hoja 1'!A:P", // <--- Nombre de tu hoja con espacio
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
          institucion || 'N/A',
          correo || 'N/A',
          rol || 'N/A',
          ...(Array.isArray(respuestas) ? respuestas : [])
        ]],
      },
    });

    return res.status(200).json({ success: true, data: response.data });

  } catch (error: any) {
    console.error('ERROR DETECTADO:', error.message);
    return res.status(500).json({ 
      error: 'Error al conectar con Google Sheets', 
      details: error.message 
    });
  }
}