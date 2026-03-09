import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
if (req.method !== 'POST') return res.status(405).send('Method not allowed');

const { institucion, correo, rol, respuestas } = req.body;

try {
const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
const formattedKey = rawKey.replace(/\n/g, '\n');

} catch (error: any) { console.error('ERROR GOOGLE:', error.message); return res.status(500).json({ error: error.message }); } }