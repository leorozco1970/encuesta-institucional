import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo permitimos el método POST para seguridad
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // 1. Configuración de la autenticación con las variables de Vercel
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Reemplazamos los saltos de línea de la clave privada
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Extraemos los datos que envía el formulario
    // Asegúrate de que tu formulario envíe estos mismos nombres
    const { institucion, correo, rol, respuestas } = req.body;

    // 3. Insertar los datos en el Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "'Hoja 1'!A:P", // <--- Nombre exacto de tu hoja con espacio
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }), // Fecha Colombia
          institucion || 'N/A',
          correo || 'N/A',
          rol || 'N/A',
          ...(Array.isArray(respuestas) ? respuestas : []) // Las 12 respuestas
        ]],
      },
    });

    return res.status(200).json({ success: true, data: response.data });

  } catch (error: any) {
    console.error('ERROR DE GOOGLE SHEETS:', error);
    return res.status(500).json({ 
      error: 'Error interno al guardar', 
      details: error.message 
    });
  }
}