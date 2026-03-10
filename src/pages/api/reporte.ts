import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  
  const { nombreInstitucion, destinoCorreo } = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: "sheets-save@encuesta-institucional-489716.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8+gPWgMiX1Ub6\nOhkIJ1du8OGIIGzSzl5+pg92z64HyxNjy5XgS5hFr78uEk6/+Q4jWkl3hWEnwpaU\n7YWkEmBm2XhNWiCCdZT1rReIjr4ZjL+HitqojkP+7w930aRzARXZ5Y/ejuZ0biGA\naM8jVxNWi5sbEnYD1QxdK2GMsdfm8i8ecbTslYJMwceg2Ekf6GUEoNi7o14oSrmh\n0L5A5MMawYurej8pIiRLBGkRxMDtz1ZIPe78EasXE9fAanU5b9o9bNKPDTiEI0yF\nd5h0ywDAsj92OPaDKGY3Uatz0Fy7+30NjQ7IN2RT91YtVQhdEI15XbYThy2+h/Nj\nNtAzDSL7AgMBAAECggEAEmtcvWckZibhJK74qqKfCI63r4Ytj+c9LviuUC/SRYCF\n6CJl/jc6uoF0pR/JXOKAfhyk8DPoHNvVbo2vitGfDiygkmA4WU7u+8/pF86F+UU5\nPpO1ArHfLyA2W0DsAlOhlsaj3RcDn7yY967/kEZtTvBg6A9xa6fel87h0riw6RnD\naBsKfTLpcdhvS7bRsnG3hxR29eH8GArCjislnikkyx57jlInkTS9M3Wi2LKdGskV\nuqMhTFIzkkfvcZvnXtX74fRXVk2ZT+UmYkAdDBmhqu3OYvWEHByhzYjtgBRaZP9L\n1quWufXVajAOVnc0UHsOjTLGRNAHiVzpDW+Mqlp7yQKBgQDlrDOP9SGyDkpx5A7Q\nQR2B03khtqGKUfDv8kuDH75AR0/hAWv/uVo/E4T6d34INNw3uqhGkYM7TvYSU1CA\ngiC228Rdg+oo/Oa9UAB0xNlYLJLHFq+4KtYGOWCclo4IMwsFTmgfC7s8meO0jkOS\noA1nYYMc9yb6xmEnV+UyVaR0aQKBgQDSo5QheGoz6OvzcdOaBB7JwHRb5+FwsBBU\nueRd9qHqBK4N8Nyhm92giBdBTZyzGIYXbIi4+Dt/Ia+xZJrLhYARtCOjxDzx/FWC\Tu1fTHlyKM5/OpwcJ6clbWJfQAoXTD4zvRwoQU0+jKUSzxrAx76Y4ZWYSt9LHOWY\sw25OjnfwwKBgHVERVd9e+Tj8xLPtNiURrKg/To/e5+aUwDQn8mljYhYYOqrxS7e\ vrtyBfW0yT77bm1t+rl9VpoTqQSWUYYr6vQypcJxtj+TUWTb0j/MuoSQzailZrcL\n+BdZeIC7Rm3dUgU1kWg4nzNEB8WK1empmu5sFXvWnapxW+2wrS/UFpHxAoGBAKHp\nK0wvCzOrrvMKY+TXlfLvBIJA04GTVHpMCcZQdlU0E7aTloSDEvD6qyV/Sxw/lZMb\n0lycMt+ePTbWZkZa7/6rwVl41oALvo7TrJK8bf3acCBMJQNfV5PlaOBekWMnMAkF\nLEelKoMSCTFUEPRulYtem2bc5pcON04RFFN09leRAoGBAMJPqPpB8DMabjGNnMtb\n2PUONmcm3p5VTUrR4RxWGlRVRc0cBLzf3SdHO7oJnuUiPhZPRaX1kWNQlZLOcax9\nEW9V8qMjD/pJoSzLkRgnU/IkSWpAE1uDvVWMANvrpfF4e3cC1tpo63t4/XpCkCCd\nWqYxjQAOKgIHnTddyMqGE0Ns\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '15oJuvgGQIFE4cbGR3VU_zZ6sEco4gKDlUa6j0aoJj_g',
      range: "'Hoja 1'!A:P",
    });

    const filas = response.data.values || [];
    const datos = filas.filter(f => f[1] && f[1].toUpperCase() === nombreInstitucion.toUpperCase());

    if (datos.length === 0) return res.status(404).json({ error: 'No hay datos' });

    // Lógica de Triangulación básica
    const totalRespuestas = datos.length;
    const porRol = {
      Directivos: datos.filter(f => f[3] === 'Directivos').length,
      Docentes: datos.filter(f => f[3] === 'Docentes').length,
      Padres: datos.filter(f => f[3] === 'Padres').length,
      Estudiantes: datos.filter(f => f[3] === 'Estudiantes').length,
    };

    // GENERACIÓN DEL PDF
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("INFORME DE ARMONIZACIÓN INSTITUCIONAL", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text(`Institución: ${nombreInstitucion}`, 20, 40);
    
    (doc as any).autoTable({
      startY: 50,
      head: [['Rol', 'Cantidad de Participantes']],
      body: Object.entries(porRol),
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] }
    });

    doc.text("Resumen de Triangulación", 20, (doc as any).lastAutoTable.finalY + 20);
    doc.setFontSize(10);
    doc.text("Este reporte consolida las percepciones de los diferentes actores educativos.", 20, (doc as any).lastAutoTable.finalY + 30);

    const pdfBase64 = doc.output('datauristring').split(',')[1];

    // ENVÍO DE CORREO USANDO TUS DATOS
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'leorozco1970@gmail.com',
        pass: 'mdso vzyq xaju vavn' // Tu clave de aplicación
      }
    });

    await transporter.sendMail({
      from: '"Diagnóstico Institucional" <leorozco1970@gmail.com>',
      to: destinoCorreo,
      subject: `Reporte de Triangulación - ${nombreInstitucion}`,
      text: `Hola, se ha generado el reporte para ${nombreInstitucion}. Adjunto encontrarás el PDF.`,
      attachments: [{ filename: `Reporte_${nombreInstitucion}.pdf`, content: pdfBase64, encoding: 'base64' }]
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
// Reintento de construcción del reporte
// Actualización de tipos para reporte