import { google } from 'googleapis';
// @ts-ignore
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
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8+gPWgMiX1Ub6\nOhkIJ1du8OGIIGzSzl5+pg92z64HyxNjy5XgS5hFr78uEk6/+Q4jWkl3hWEnwpaU\n7YWkEmBm2XhNWiCCdZT1rReIjr4ZjL+HitqojkP+7w930aRzARXZ5Y/ejuZ0biGA\naM8jVxNWi5sbEnYD1QxdK2GMsdfm8i8ecbTslYJMwceg2Ekf6GUEoNi7o14oSrmh\n0L5A5MMawYurej8pIiRLBGkRxMDtz1ZIPe78EasXE9fAanU5b9o9bNKPDTiEI0yF\nd5h0ywDAsj92OPaDKGY3Uatz0Fy7+30NjQ7IN2RT91YtVQhdEI15XbYThy2+h/Nj\nNtAzDSL7AgMBAAECggEAEmtcvWckZibhJK74qqKfCI63r4Ytj+c9LviuUC/SRYCF\n6CJl/jc6uoF0pR/JXOKAfhyk8DPoHNvVbo2vitGfDiygkmA4WU7u+8/pF86F+UU5\nPpO1ArHfLyA2W0DsAlOhlsaj3RcDn7yY967/kEZtTvBg6A9xa6fel87h0riw6RnD\naBsKfTLpcdhvS7bRsnG3hxR29eH8GArCjislnikkyx57jlInkTS9M3Wi2LKdGskV\nuqMhTFIzkkfvcZvnXtX74fRXVk2ZT+UmYkAdDBmhqu3OYvWEHByhzYjtgBRaZP9L\n1quWufXVajAOVnc0UHsOjTLGRNAHiVzpDW+Mqlp7yQKBgQDlrDOP9SGyDkpx5A7Q\nQR2B03khtqGKUfDv8kuDH75AR0/hAWv/uVo/E4T6d34INNw3uqhGkYM7TvYSU1CA\giC228Rdg+oo/Oa9UAB0xNlYLJLHFq+4KtYGOWCclo4IMwsFTmgfC7s8meO0jkOS\noA1nYYMc9yb6xmEnV+UyVaR0aQKBgQDSo5QheGoz6OvzcdOaBB7JwHRb5+FwsBBU\ ueRd9qHqBK4N8Nyhm92giBdBTZyzGIYXbIi4+Dt/Ia+xZJrLhYARtCOjxDzx/FWC\Tu1fTHlyKM5/OpwcJ6clbWJfQAoXTD4zvRwoQU0+jKUSzxrAx76Y4ZWYSt9LHOWY\sw25OjnfwwKBgHVERVd9e+Tj8xLPtNiURrKg/To/e5+aUwDQn8mljYhYYOqrxS7e\ vrtyBfW0yT77bm1t+rl9VpoTqQSWUYYr6vQypcJxtj+TUWTb0j/MuoSQzailZrcL\n+BdZeIC7Rm3dUgU1kWg4nzNEB8WK1empmu5sFXvWnapxW+2wrS/UFpHxAoGBAKHp\nK0wvCzOrrvMKY+TXlfLvBIJA04GTVHpMCcZQdlU0E7aTloSDEvD6qyV/Sxw/lZMb\n0lycMt+ePTbWZkZa7/6rwVl41oALvo7TrJK8bf3acCBMJQNfV5PlaOBekWMnMAkF\nLEelKoMSCTFUEPRulYtem2bc5pcON04RFFN09leRAoGBAMJPqPpB8DMabjGNnMtb\n2PUONmcm3p5VTUrR4RxWGlRVRc0cBLzf3SdHO7oJnuUiPhZPRaX1kWNQlZLOcax9\nEW9V8qMjD/pJoSzLkRgnU/IkSWpAE1uDvVWMANvrpfF4e3cC1tpo63t4/XpCkCCd\nWqYxjQAOKgIHnTddyMqGE0Ns\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: '15oJuvgGQIFE4cbGR3VU_zZ6sEco4gKDlUa6j0aoJj_g',
      range: "'Hoja 1'!A1:P2000",
    });

    const filas = resSheet.data.values || [];
    
    // FUNCIÓN DE LIMPIEZA PROFUNDA: Quita tildes, puntos, espacios y SALTOS DE LÍNEA
    const limpiar = (t: string) => 
      t ? t.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase().trim() : "";

    const busqueda = limpiar(nombreInstitucion);
    const datos = filas.filter(f => f[1] && limpiar(f[1]).includes(busqueda));

    if (datos.length === 0) return res.status(404).json({ error: 'No se encontraron datos.' });

    // --- CÁLCULOS ---
    const estamentos = {
      Directivos: datos.filter(f => limpiar(f[3]).includes('directivo')).length,
      Docentes: datos.filter(f => limpiar(f[3]).includes('docente')).length,
      Estudiantes: datos.filter(f => limpiar(f[3]).includes('estudiante')).length,
      Padres: datos.filter(f => limpiar(f[3]).includes('padre')).length
    };

    const puntaje = (v: string) => {
      const m: any = { "Mucho": 100, "Siempre": 100, "Totalmente": 100, "Algo": 75, "Poco": 50, "Nada": 25 };
      return m[v] || 0;
    };

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("INFORME DIAGNÓSTICO PROFESIONAL PTA/FI 3.0", 105, 20, { align: "center" });
    
    // Limpiamos el nombre para que salga bonito en el PDF sin saltos de línea
    const nombreLimpioParaPDF = datos[0][1].toString().replace(/\n/g, ' ');
    doc.setFontSize(12);
    doc.text(`Institución: ${nombreLimpioParaPDF}`, 20, 35);

    (doc as any).autoTable({
      startY: 45,
      head: [['Estamento', 'Cant. Participantes']],
      body: [['Directivos', estamentos.Directivos], ['Docentes', estamentos.Docentes], ['Estudiantes', estamentos.Estudiantes], ['Padres', estamentos.Padres]],
    });

    const ejes = [
      { t: "EJE 1: CONVIVENCIA", col: 7, actors: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante']] },
      { t: "EJE 2: CRESE", col: 5, actors: [['Directivos','directivo'], ['Docentes','docente']] },
      { t: "EJE 3: TERRITORIO", col: 9, actors: [['Directivos','directivo'], ['Docentes','docente']] }
    ];

    let y = (doc as any).lastAutoTable.finalY + 15;
    ejes.forEach(e => {
      doc.setFont("helvetica", "bold"); doc.text(e.t, 20, y);
      const rows = e.actors.map(actor => {
        const sub = datos.filter(f => limpiar(f[3]).includes(actor[1]));
        let suma = 0, count = 0;
        sub.forEach(f => { if (f[e.col]) { suma += puntaje(f[e.col]); count++; } });
        return [actor[0], count > 0 ? (suma/count).toFixed(1) + "%" : "0%"];
      });
      (doc as any).autoTable({ startY: y + 5, head: [['Actor', 'Favorabilidad']], body: rows });
      y = (doc as any).lastAutoTable.finalY + 15;
    });

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'leorozco1970@gmail.com', pass: 'mdso vzyq xaju vavn' } });
    await transporter.sendMail({
      from: '"Reporte PTA" <leorozco1970@gmail.com>',
      to: destinoCorreo,
      subject: `📊 Informe Final: ${nombreInstitucion}`,
      attachments: [{ filename: `Informe_Diagnostico.pdf`, content: Buffer.from(doc.output('arraybuffer')) }]
    });

    res.status(200).json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}