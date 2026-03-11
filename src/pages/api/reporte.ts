import { google } from 'googleapis';
// @ts-ignore
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    // Limpiador antibloqueos que ya comprobamos que funciona
    const limpiar = (t: string) => t ? t.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase().trim() : "";
    const busqueda = limpiar(nombreInstitucion);
    const datos = filas.filter(f => f[1] && limpiar(f[1]).includes(busqueda));

    if (datos.length === 0) return res.status(404).json({ error: 'No se encontraron datos.' });

    // --- CÁLCULOS PROFESIONALES ---
    const estamentos = {
      Directivos: datos.filter(f => f[3] && limpiar(f[3]).includes('directivo')).length,
      Docentes: datos.filter(f => f[3] && limpiar(f[3]).includes('docente')).length,
      Estudiantes: datos.filter(f => f[3] && limpiar(f[3]).includes('estudiante')).length,
      Padres: datos.filter(f => f[3] && limpiar(f[3]).includes('padre')).length
    };

    const puntaje = (v: string) => {
      if (!v) return 0;
      const val = v.trim().toLowerCase();
      if (val === "mucho" || val === "siempre" || val === "totalmente") return 100;
      if (val === "algo" || val === "casi siempre" || val === "a veces") return 75;
      if (val === "poco" || val === "nunca") return 50;
      if (val === "nada") return 25;
      return 0;
    };

    const doc = new jsPDF();
    
    // --- ENCABEZADO Y PROPÓSITO ---
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INFORME DIAGNÓSTICO PROFESIONAL PTA/FI 3.0", 105, 20, { align: "center" });

    const nombreLimpioParaPDF = datos[0][1].toString().replace(/\n/g, ' ');
    doc.setFontSize(11);
    doc.text(`Institución: ${nombreLimpioParaPDF}`, 20, 32);

    // Texto del Propósito
    doc.setFont("helvetica", "italic");
    const propositoTexto = "Propósito: Comprender profundamente el contexto territorial, institucional y comunitario para fundamentar decisiones pedagógicas pertinentes.";
    const lineasProposito = doc.splitTextToSize(propositoTexto, 170);
    doc.text(lineasProposito, 20, 42);

    let yActual = 42 + (lineasProposito.length * 6) + 5;

    // Tabla inicial
    autoTable(doc, {
      startY: yActual,
      head: [['Estamento', 'Cant. Participantes']],
      body: [
        ['Directivos', estamentos.Directivos],
        ['Docentes', estamentos.Docentes],
        ['Estudiantes', estamentos.Estudiantes],
        ['Padres', estamentos.Padres]
      ],
    });

    // Configuración de los Ejes y sus textos pedagógicos
    const ejes = [
      { 
        t: "EJE 1: CONVIVENCIA", col: 7, 
        desc: "Evalúa el clima escolar, las relaciones interpersonales y las estrategias de resolución de conflictos dentro de la institución educativa.",
        triang: "Triangulación: Esta lectura contrastada permite identificar las brechas de percepción sobre la convivencia escolar, señalando puntos de encuentro y áreas críticas que requieren intervención pedagógica.",
        actors: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante'], ['Padres','padre']] 
      },
      { 
        t: "EJE 2: CRESE", col: 5, 
        desc: "Analiza el desarrollo de competencias ciudadanas, socioemocionales y la promoción de estilos de vida saludables en la comunidad.",
        triang: "Triangulación: Al comparar las visiones de los actores, se evidencia el nivel real de apropiación e impacto de las competencias socioemocionales en el entorno educativo.",
        actors: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante']] 
      },
      { 
        t: "EJE 3: TERRITORIO", col: 9, 
        desc: "Revisa la vinculación de la escuela con su entorno, el reconocimiento de saberes locales y la participación de la comunidad.",
        triang: "Triangulación: El contraste de estas perspectivas visibiliza si la escuela está funcionando como un ecosistema abierto e integrado a la realidad de su contexto territorial.",
        actors: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante']] 
      },
      { 
        t: "EJE 4: CENTROS DE INTERÉS", col: 6, 
        desc: "Valora la implementación de espacios pedagógicos diversificados que respondan a las verdaderas motivaciones y necesidades de los estudiantes.",
        triang: "Triangulación: Analizar estos datos en conjunto determina la pertinencia de la oferta educativa extraescolar frente a las expectativas de la comunidad de aprendizaje.",
        actors: [['Directivos','directivo'], ['Docentes','docente'], ['Estudiantes','estudiante']] 
      }
    ];

    yActual = (doc as any).lastAutoTable.finalY + 15;

    ejes.forEach(e => {
      // Salto de página automático si estamos muy abajo en la hoja
      if (yActual > 230) { doc.addPage(); yActual = 20; }
      
      // Título del Eje
      doc.setFont("helvetica", "bold"); 
      doc.text(e.t, 20, yActual);
      yActual += 7;

      // Descripción del Eje
      doc.setFont("helvetica", "normal");
      const lineasDesc = doc.splitTextToSize(e.desc, 170);
      doc.text(lineasDesc, 20, yActual);
      yActual += (lineasDesc.length * 6) + 3;

      // Calcular datos de la tabla
      const rows = e.actors.map(actor => {
        const sub = datos.filter(f => f[3] && limpiar(f[3]).includes(actor[1]));
        let suma = 0, count = 0;
        sub.forEach(f => { if (f[e.col]) { suma += puntaje(f[e.col]); count++; } });
        return [actor[0], count > 0 ? (suma/count).toFixed(1) + "%" : "0%"];
      });

      // Dibujar tabla
      autoTable(doc, { startY: yActual, head: [['Actor', 'Favorabilidad']], body: rows });
      yActual = (doc as any).lastAutoTable.finalY + 7;

      // Texto de Triangulación
      doc.setFont("helvetica", "italic");
      const lineasTriang = doc.splitTextToSize(e.triang, 170);
      doc.text(lineasTriang, 20, yActual);
      yActual += (lineasTriang.length * 6) + 15; // Dejamos espacio para el siguiente eje
    });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // --- CORREO CON MENSAJE DE LA CDA G9 ---
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'leorozco1970@gmail.com', pass: 'mdso vzyq xaju vavn' } });
    await transporter.sendMail({
      from: '"CDA G9 AVANZANDO" <leorozco1970@gmail.com>',
      to: destinoCorreo,
      subject: `📊 Informe Diagnóstico: ${nombreLimpioParaPDF}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1e3a8a;">Cordial saludo,</h2>
          <p style="font-size: 16px;">
            <b>LA CDA G9 AVANZANDO LES ENVÍA EL REPORTE DEL DIAGNÓSTICO INSTITUCIONAL.</b>
          </p>
          <p>Adjunto a este correo encontrará el documento PDF con los resultados detallados y la triangulación pedagógica.</p>
          <br/>
          <p style="font-size: 12px; color: #666;">Este es un mensaje generado automáticamente.</p>
        </div>
      `,
      attachments: [{ filename: `Informe_Diagnostico_PTA.pdf`, content: pdfBuffer }]
    });

    res.status(200).json({ ok: true });
  } catch (e: any) { 
    console.error(e);
    res.status(500).json({ error: `Error interno: ${e.message}` }); 
  }
}