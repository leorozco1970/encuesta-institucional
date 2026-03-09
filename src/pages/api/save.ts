import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Método no permitido' });
}

const { institucion, correo, rol, respuestas } = req.body;

try {
const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
const formattedKey = rawKey
.replace(/\n/g, '\n')
.replace(/"/g, '')
.trim();

} catch (error: any) {
console.error('ERROR EN EL SERVIDOR:', error.message);
return res.status(500).json({
error: 'Error de Google',
details: error.message
});
}
}