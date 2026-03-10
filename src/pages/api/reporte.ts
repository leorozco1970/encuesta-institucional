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
      range: 'A:P',
    });

    const filas = resSheet.data.values || [];
    
    // FUNCIÓN DE LIMPIEZA CLAVE: Elimina tildes, saltos de línea y dobles espacios
    const limpiarParaBuscar = (t: string) => 
      t ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\n/g, " ").replace(/\s+/g, ' ').toLowerCase().trim() : "";

    const query = limpiarParaBuscar(nombreInstitucion);
    // Filtrar: Columna B (índice 1) es la Institución
    const datos = filas.filter(f => f[1] && limpiarParaBuscar(f[1]).includes(query));

    if (datos.length === 0) return res.status(404).json({ error: 'No se encontraron datos para esta institución.' });

    // CONTEO DE PARTICIPANTES: Columna D (índice 3) es el Estamento/Rol
    const conteo = {
      Directivos: datos.filter(f => limpiarParaBuscar(f[3]).includes('directivo')).length,
      Docentes: datos.filter(f => limpiarParaBuscar(f[3]).includes('docente')).length,
      Estudiantes: datos.filter(f => limpiarParaBuscar(f[3]).includes('estudiante')).length,
      Padres: datos.filter(f => limpiarParaBuscar(f[3]).includes('padre')).length
    };

    const puntaje = (v: string) => {
      const m: any = { "Mucho": 100, "Siempre": 100, "Totalmente": 100, "Muy positivo": 100, "Alto": 100, "Algo": 75, "Casi siempre": 75, "Positivo": 75, "Medio": 75, "Poco": 50, "A veces": 50, "Regular": 50, "Bajo": 50, "Nada": 25, "Nunca": 25, "Negativo": 25 };
      return m[v] || 0;
    };

    const calcularEje = (rolKeyword: string, colIndex: number) => {
      const sub = datos.filter(f => limpiarParaBuscar(f[3]).includes(rolKeyword));
      if (sub.length === 0) return "N/A";
      let suma = 0, cont = 0;
      sub.forEach(f => { if (f[colIndex]) { suma += puntaje(f[colIndex]); cont++; } });
      return cont > 0 ? (suma / cont).toFixed(1) + "%" : "0.0%";
    };

    // --- CONFIGURACIÓN DEL PDF PROFESIONAL ---
    const doc = new jsPDF();
    const azul = [30, 58, 138];
    const grisOscuro = [60, 60, 60];

    // Encabezado con Rectángulo Azul
    doc.setFillColor(azul[0], azul[1], azul[2]);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INFORME DIAGNÓSTICO INSTITUCIONAL PTA/FI 3.0", 105, 22, { align: "center" });
    doc.setFontSize(10);
    doc.text("SISTEMA AUTOMATIZADO DE ANÁLISIS DE PERCEPCIÓN PEDAGÓGICA", 105, 32, { align: "center" });

    // 1. PROPÓSITO
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("1. PROPÓSITO DEL INFORME", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const prop = "Este documento presenta una síntesis analítica de la percepción de los diversos actores de la comunidad educativa. El propósito es facilitar la toma de decisiones basada en datos para fortalecer la ruta de acompañamiento pedagógico e institucional.";
    doc.text(doc.splitTextToSize(prop, 170), 20, 62);

    // 2. MUESTRA (CANTIDADES)
    doc.setFont("helvetica", "bold");
    doc.text(`2. MUESTRA PARTICIPATIVA: ${nombreInstitucion.toUpperCase()}`, 20, 85);
    (doc as any).autoTable({
      startY: 90,
      head: [['Estamento', 'Cant. Participantes', 'Estado']],
      body: [
        ['Directivos', conteo.Directivos, 'Completado'],
        ['Docentes', conteo.Docentes, 'Completado'],
        ['Estudiantes', conteo.Estudiantes, 'Completado'],
        ['Padres de Familia', conteo.Padres, 'Completado'],
        ['TOTAL GENERAL', datos.length, '-']
      ],
      theme: 'grid',
      headStyles: { fillColor: grisOscuro }
    });

    // 3. EJES Y TRIANGULACIÓN
    const ejes = [
      { t: "EJE 1: CONVIVENCIA Y CLIMA ESCOLAR", p: "Analiza la armonía en las relaciones, la seguridad emocional y el sentido de pertenencia.", col: 7, r: [['Directivos','directivo'], ['Docentes','docente'], ['Padres','padre'], ['Estudiantes','estudiante']] },
      { t: "EJE 2: DESARROLLO SOCIOEMOCIONAL (CRESE)", p: "Mide cómo se integra el manejo de emociones y la formación ciudadana en la escuela.", col: 4, r: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante']] },
      { t: "EJE 3: PERTINENCIA TERRITORIAL", p: "Vínculo entre los saberes escolares y la realidad del contexto barrial/comunitario.", col: 9, r: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante']] },
      { t: "EJE 4: CENTROS DE INTERÉS", p: "Eficacia de los espacios de formación complementaria en el desarrollo de talentos.", col: 5, r: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante']] }
    ];

    let currentY = (doc as any).lastAutoTable.finalY + 15;

    ejes.forEach((eje) => {
      if (currentY > 230) { doc.addPage(); currentY = 25; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(eje.t, 20, currentY);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      doc.text(doc.splitTextToSize(eje.p, 170), 20, currentY + 5);
      
      (doc as any).autoTable({
        startY: currentY + 10,
        head: [['Estamento (Triangulación)', 'Favorabilidad (%)']],
        body: eje.r.map(r => [r[0], calcularEje(r[1], eje.col)]),
        headStyles: { fillColor: azul },
        margin: { left: 25 },
        styles: { fontSize: 9 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    });

    // --- ENVÍO POR EMAIL ---
    const pdfOutput = Buffer.from(doc.output('arraybuffer'));
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'leorozco1970@gmail.com', pass: 'mdso vzyq xaju vavn' } });
    
    await transporter.sendMail({
      from: '"PTA/FI 3.0" <leorozco1970@gmail.com>',
      to: destinoCorreo,
      subject: `📊 Diagnóstico Consolidado: ${nombreInstitucion}`,
      text: `Se adjunta el informe técnico de percepción institucional para la sede ${nombreInstitucion}.`,
      attachments: [{ filename: `Informe_${nombreInstitucion}.pdf`, content: pdfOutput }]
    });

    res.status(200).json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}