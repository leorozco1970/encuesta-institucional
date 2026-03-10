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
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8+gPWgMiX1Ub6\nOhkIJ1du8OGIIGzSzl5+pg92z64HyxNjy5XgS5hFr78uEk6/+Q4jWkl3hWEnwpaU\n7YWkEmBm2XhNWiCCdZT1rReIjr4ZjL+HitqojkP+7w930aRzARXZ5Y/ejuZ0biGA\naM8jVxNWi5sbEnYD1QxdK2GMsdfm8i8ecbTslYJMwceg2Ekf6GUEoNi7o14oSrmh\n0L5A5MMawYurej8pIiRLBGkRxMDtz1ZIPe78EasXE9fAanU5b9o9bNKPDTiEI0yF\nd5h0ywDAsj92OPaDKGY3Uatz0Fy7+30NjQ7IN2RT91YtVQhdEI15XbYThy2+h/Nj\nNtAzDSL7AgMBAAECggEAEmtcvWckZibhJK74qqKfCI63r4Ytj+c9LviuUC/SRYCF\n6CJl/jc6uoF0pR/JXOKAfhyk8DPoHNvVbo2vitGfDiygkmA4WU7u+8/pF86F+UU5\nPpO1ArHfLyA2W0DsAlOhlsaj3RcDn7yY967/kEZtTvBg6A9xa6fel87h0riw6RnD\naBsKfTLpcdhvS7bRsnG3hxR29eH8GArCjislnikkyx57jlInkTS9M3Wi2LKdGskV\nuqMhTFIzkkfvcZvnXtX74fRXVk2ZT+UmYkAdDBmhqu3OYvWEHByhzYjtgBRaZP9L\n1quWufXVajAOVnc0UHsOjTLGRNAHiVzpDW+Mqlp7yQKBgQDlrDOP9SGyDkpx5A7Q\nQR2B03khtqGKUfDv8kuDH75AR0/hAWv/uVo/E4T6d34INNw3uqhGkYM7TvYSU1CA\giC228Rdg+oo/Oa9UAB0xNlYLJLHFq+4KtYGOWCclo4IMwsFTmgfC7s8meO0jkOS\noA1nYYMc9yb6xmEnV+UyVaR0aQKBgQDSo5QheGoz6OvzcdOaBB7JwHRb5+FwsBBU\nueRd9qHqBK4N8Nyhm92giBdBTZyzGIYXbIi4+Dt/Ia+xZJrLhYARtCOjxDzx/FWC\Tu1fTHlyKM5/OpwcJ6clbWJfQAoXTD4zvRwoQU0+jKUSzxrAx76Y4ZWYSt9LHOWY\sw25OjnfwwKBgHVERVd9e+Tj8xLPtNiURrKg/To/e5+aUwDQn8mljYhYYOqrxS7e\ vrtyBfW0yT77bm1t+rl9VpoTqQSWUYYr6vQypcJxtj+TUWTb0j/MuoSQzailZrcL\n+BdZeIC7Rm3dUgU1kWg4nzNEB8WK1empmu5sFXvWnapxW+2wrS/UFpHxAoGBAKHp\nK0wvCzOrrvMKY+TXlfLvBIJA04GTVHpMCcZQdlU0E7aTloSDEvD6qyV/Sxw/lZMb\n0lycMt+ePTbWZkZa7/6rwVl41oALvo7TrJK8bf3acCBMJQNfV5PlaOBekWMnMAkF\nLEelKoMSCTFUEPRulYtem2bc5pcON04RFFN09leRAoGBAMJPqPpB8DMabjGNnMtb\n2PUONmcm3p5VTUrR4RxWGlRVRc0cBLzf3SdHO7oJnuUiPhZPRaX1kWNQlZLOcax9\nEW9V8qMjD/pJoSzLkRgnU/IkSWpAE1uDvVWMANvrpfF4e3cC1tpo63t4/XpCkCCd\nWqYxjQAOKgIHnTddyMqGE0Ns\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: '15oJuvgGQIFE4cbGR3VU_zZ6sEco4gKDlUa6j0aoJj_g',
      range: 'A:P', 
    });

    const filas = resSheet.data.values || [];
    const limpiar = (t: string) => t ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";
    const busqueda = limpiar(nombreInstitucion);

    // FILTRO: Buscamos en la Columna B (índice 1)
    const datos = filas.filter(f => f[1] && limpiar(f[1]).includes(busqueda));

    if (datos.length === 0) return res.status(404).json({ error: 'No se encontraron datos.' });

    // CONTEO: Usamos la Columna D (índice 3) para los Roles
    const conteo = {
      Directivos: datos.filter(f => limpiar(f[3]) === 'directivos').length,
      Docentes: datos.filter(f => limpiar(f[3]) === 'docentes').length,
      Estudiantes: datos.filter(f => limpiar(f[3]) === 'estudiantes').length,
      Padres: datos.filter(f => limpiar(f[3]) === 'padres').length
    };

    const puntaje = (v: string) => {
      const m: any = { "Mucho": 100, "Siempre": 100, "Algo": 75, "Casi siempre": 75, "Poco": 50, "A veces": 50, "Nada": 25, "Nunca": 25 };
      return m[v] || 0;
    };

    const calcularEje = (rol: string, offset: number) => {
      const sub = datos.filter(f => limpiar(f[3]) === limpiar(rol));
      if (sub.length === 0) return "0.0%";
      // Las respuestas empiezan en Columna E (índice 4)
      const val = sub[0][offset + 4];
      return val ? puntaje(val).toFixed(1) + "%" : "0.0%";
    };

    const doc = new jsPDF();
    const azul = [30, 58, 138];
    doc.setFillColor(azul[0], azul[1], azul[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18); doc.text("INFORME DIAGNÓSTICO PTA/FI 3.0", 105, 25, { align: "center" });

    doc.setTextColor(0, 0, 0); doc.setFontSize(10);
    doc.text(`Institución: ${datos[0][1]}`, 20, 55);

    (doc as any).autoTable({
      startY: 65,
      head: [['Muestra', 'Directivos', 'Docentes', 'Estudiantes', 'Padres', 'TOTAL']],
      body: [['Cantidades', conteo.Directivos, conteo.Docentes, conteo.Estudiantes, conteo.Padres, datos.length]],
      theme: 'grid'
    });

    const configEjes = [
      { t: "EJE 1: CONVIVENCIA", off: 4, r: ['Directivos','Docentes','Padres','Estudiantes'] },
      { t: "EJE 2: SOCIOEMOCIONAL", off: 1, r: ['Directivos','Docentes','Estudiantes'] },
      { t: "EJE 3: TERRITORIO", off: 5, r: ['Directivos','Docentes','Estudiantes'] },
      { t: "EJE 4: CENTROS DE INTERÉS", off: 2, r: ['Directivos','Docentes','Estudiantes'] }
    ];

    let y = (doc as any).lastAutoTable.finalY + 10;
    configEjes.forEach(eje => {
      doc.setFont("helvetica", "bold"); doc.text(eje.t, 20, y);
      (doc as any).autoTable({
        startY: y + 2,
        head: [['Triangulación por Rol', 'Índice de Percepción']],
        body: eje.r.map(rol => [rol, calcularEje(rol, eje.off)]),
        headStyles: { fillColor: azul }
      });
      y = (doc as any).lastAutoTable.finalY + 12;
    });

    const pdfOutput = Buffer.from(doc.output('arraybuffer'));
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'leorozco1970@gmail.com', pass: 'mdso vzyq xaju vavn' } });
    
    await transporter.sendMail({
      from: '"PTA/FI 3.0" <leorozco1970@gmail.com>',
      to: destinoCorreo,
      subject: `📊 Informe Diagnóstico: ${nombreInstitucion}`,
      attachments: [{ filename: `Informe_${nombreInstitucion}.pdf`, content: pdfOutput }]
    });

    res.status(200).json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}