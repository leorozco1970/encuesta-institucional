import React, { useState } from 'react';
import { 
  UserCircle, Users, BookOpen, GraduationCap, Lock, 
  CheckCircle2, Check, Loader2, School, FileText 
} from 'lucide-react';

// --- 1. CONFIGURACIÓN DE ACCESO ---
const ACCESO: any = {
  Directivos: { pin: "1111", total: 12, ids: ['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12'] },
  Docentes: { pin: "2222", total: 12, ids: ['doc1','doc2','doc3','doc4','doc5','doc6','doc7','doc8','doc9','doc10','doc11','doc12'] },
  Padres: { pin: "3333", total: 10, ids: ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10'] },
  Estudiantes: { pin: "4444", total: 12, ids: ['e1','e2','e3','e4','e5','e6','e7','e8','e9','e10','e11','e12'] }
};

// --- 2. COMPONENTES DE DISEÑO ---
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }: any) => {
  const variants: any = {
    primary: disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-xl transform hover:scale-[1.02]",
    ghost: "text-gray-500 hover:bg-gray-100 font-bold"
  };
  return (
    <button disabled={disabled} type={type} onClick={onClick} className={`px-8 py-5 rounded-3xl font-black transition-all flex items-center justify-center gap-3 tracking-tight ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

function Question({ label, id, options, respuestas, onCheck }: any) {
  return (
    <div className="space-y-6">
      <p className="text-2xl font-black text-slate-800 leading-tight">{label} <span className="text-red-500">*</span></p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt: string) => (
          <label key={opt} className={`flex items-center p-7 rounded-[30px] border-2 cursor-pointer transition-all ${respuestas[id] === opt ? 'border-[#1e3a8a] bg-blue-50 shadow-inner' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
            <input type="radio" className="hidden" checked={respuestas[id] === opt} onChange={() => onCheck(id, opt)} />
            <div className={`w-8 h-8 rounded-full border-4 mr-4 flex items-center justify-center ${respuestas[id] === opt ? 'border-[#1e3a8a] bg-[#1e3a8a]' : 'border-slate-200'}`}>
              {respuestas[id] === opt && <div className="w-3 h-3 bg-white rounded-full shadow-sm" />}
            </div>
            <span className={`text-xl leading-tight ${respuestas[id] === opt ? 'font-black text-[#1e3a8a]' : 'font-semibold text-slate-500'}`}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function MultiSelect({ label, id, options, respuestas, onCheck }: any) {
  const actuales = (respuestas[id] as string[]) || [];
  const handleToggle = (val: string) => {
    if (actuales.includes(val)) onCheck(id, actuales.filter(v => v !== val));
    else if (actuales.length < 3) onCheck(id, [...actuales, val]);
  };
  return (
    <div className="space-y-6 p-10 bg-slate-50 rounded-[50px] border-2 border-slate-100 shadow-inner">
      <p className="text-2xl font-black text-slate-800">{label} * <span className="block text-blue-600 text-sm uppercase font-black mt-2">Máximo 3</span></p>
      <div className="grid grid-cols-1 gap-4">
        {options.map((opt: string) => (
          <label key={opt} className={`flex items-center p-6 rounded-[25px] border-2 cursor-pointer transition-all ${actuales.includes(opt) ? 'border-[#1e3a8a] bg-white shadow-md' : 'border-transparent bg-white/40'}`}>
            <input type="checkbox" className="hidden" checked={actuales.includes(opt)} onChange={() => handleToggle(opt)} />
            <div className={`w-8 h-8 rounded-xl border-4 mr-4 flex items-center justify-center ${actuales.includes(opt) ? 'bg-[#1e3a8a] border-[#1e3a8a]' : 'border-slate-200'}`}>
              {actuales.includes(opt) && <Check size={20} className="text-white font-black" />}
            </div>
            <span className={`text-xl font-bold ${actuales.includes(opt) ? 'text-[#1e3a8a]' : 'text-slate-500'}`}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// --- 3. FORMULARIOS POR ROL ---
const FormDirectivos = ({r, g}: any) => (
  <>
    <Question label="1. El contexto social y cultural de los estudiantes se integra en el diseño de los centros de interés." id="d1" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="2. La institución promueve el desarrollo socioemocional (CRESE) mediante los centros de interés." id="d2" options={["Siempre", "Casi siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="3. Los centros de interés responden a los intereses reales de los estudiantes." id="d3" options={["Totalmente", "En gran parte", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="4. El tiempo escolar dedicado a los centros de interés se utiliza de forma pedagógica y formativa." id="d4" options={["Siempre", "Casi siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="5. El impacto de los centros de interés en la convivencia escolar es:" id="d5" options={["Muy positivo", "Positivo", "Regular", "Negativo"]} respuestas={r} onCheck={g} />
    <Question label="6. Las actividades de los centros de interés se articulan con el contexto del territorio." id="d6" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="7. El nivel general de participación de los estudiantes en los centros de interés es:" id="d7" options={["Alto", "Medio", "Bajo", "Muy bajo"]} respuestas={r} onCheck={g} />
    <Question label="8. Los centros de interés han mejorado el rendimiento académico y la motivación de los estudiantes." id="d8" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <MultiSelect label="9. ¿Cuáles son los principales impactos positivos de los centros de interés?" id="d9" options={["Mejora emocional", "Motivación", "Convivencia", "Territorio", "Habilidades", "Inclusión"]} respuestas={r} onCheck={g} />
    <MultiSelect label="10. ¿Qué aspectos de los centros de interés deben fortalecerse?" id="d10" options={["Diversidad", "Currículo", "Recursos", "Capacitación", "Evaluación", "Familias"]} respuestas={r} onCheck={g} />
    <Question label="11. La institución ha avanzado en la resignificación escolar al otorgar tiempo y espacio:" id="d11" options={["Sí, jornada escolar", "Sí, jornada contraria", "Sí, ambas", "No ha otorgado"]} respuestas={r} onCheck={g} />
    <Question label="12. ¿El desarrollo de los centros en jornada escolar afecta negativamente otras asignaturas?" id="d12" options={["Mucho", "Algo", "Poco", "Nada (no afecta)"]} respuestas={r} onCheck={g} />
  </>
);

const FormDocentes = ({r, g}: any) => (
  <>
    <Question label="1. Conozco las características sociales, familiares e intereses de mis estudiantes." id="doc1" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="2. Se trabaja el manejo de emociones con los estudiantes mediante los centros de interés (CRESE)." id="doc2" options={["Siempre", "Casi siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="3. Los centros de interés favorecen la motivación por aprender de mis estudiantes." id="doc3" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="4. El tiempo en centros de interés permite desarrollar experiencias pedagógicas significativas." id="doc4" options={["Siempre", "Casi siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="5. El impacto de los centros de interés en la convivencia del aula/grupo es:" id="doc5" options={["Muy positivo", "Positivo", "Regular", "Negativo"]} respuestas={r} onCheck={g} />
    <Question label="6. Las actividades de los centros de interés se relacionan con el entorno de los estudiantes." id="doc6" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="7. El nivel de participación de mis estudiantes en los centros de interés es:" id="doc7" options={["Alto", "Medio", "Bajo", "Muy bajo"]} respuestas={r} onCheck={g} />
    <Question label="8. Los centros de interés han impactado positivamente el desarrollo integral de mis estudiantes." id="doc8" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <MultiSelect label="9. ¿Qué mejoras has observado en tu práctica pedagógica gracias a los centros de interés?" id="doc9" options={["Mayor motivación", "Facilita gestión aula", "Temas transversales", "Reduce conflictos", "Atención individualizada", "Enlaza contexto real"]} respuestas={r} onCheck={g} />
    <MultiSelect label="10. Para mejorar el impacto se necesita fortalecer:" id="doc10" options={["Alineación currículo", "Estrategias didácticas", "Recursos didácticos", "Apoyo institucional", "Tiempo asignado", "Evaluación formativa"]} respuestas={r} onCheck={g} />
    <Question label="11. La institución ha otorgado tiempo y espacio suficiente para el desarrollo óptimo:" id="doc11" options={["Sí, jornada escolar", "Sí, jornada contraria", "Sí, ambas", "No tengo tiempo/espacio"]} respuestas={r} onCheck={g} />
    <Question label="12. ¿El tiempo dedicado a los centros afecta negativamente el desarrollo de otras clases?" id="doc12" options={["Mucho", "Algo", "Poco", "Nada (no afecta)"]} respuestas={r} onCheck={g} />
  </>
);

const FormPadres = ({r, g}: any) => (
  <>
    <Question label="1. He notado cambios positivos en el comportamiento de mi hijo(a) debido a los centros de interés." id="p1" options={["Muchos", "Algunos", "Pocos", "Ninguno"]} respuestas={r} onCheck={g} />
    <Question label="2. La escuela promueve valores como respeto y responsabilidad." id="p2" options={["Siempre", "Casi siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="3. Mi hijo(a) participa en los centros de interés." id="p3" options={["Siempre", "A veces", "Casi nunca", "No sé"]} respuestas={r} onCheck={g} />
    <Question label="4. El tiempo que mi hijo(a) pasa en los centros de interés se aprovecha bien." id="p4" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="5. Los centros de interés favorecen el bienestar y la convivencia de mi hijo(a)." id="p5" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <MultiSelect label="6. ¿En qué ha notado mayor cambio positivo en su hijo(a)?" id="p6" options={["Manejo emociones", "Comportamiento", "Responsabilidad", "Motivación estudiar", "Relaciones sociales", "Habilidades creativeas"]} respuestas={r} onCheck={g} />
    <Question label="7. La escuela tiene en cuenta el contexto familiar y territorial." id="p7" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="8. Los centros de interés han aumentado el interés por asistir a la escuela." id="p8" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="9. Mi hijo(a) ha adquirido nuevas habilidades o conocimientos." id="p9" options={["Muchas", "Algunas", "Pocas", "Ninguna"]} respuestas={r} onCheck={g} />
    <Question label="10. En general, el impacto de los centros de interés en el desarrollo de mi hijo(a) es:" id="p10" options={["Muy positivo", "Positivo", "Regular", "Negativo"]} respuestas={r} onCheck={g} />
  </>
);

const FormEstudiantes = ({r, g}: any) => (
  <>
    <Question label="1. En los centros de interés aprendo a manejar mejor mis emociones." id="e1" options={["Siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="2. Me gustan los centros de interés." id="e2" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="3. Durante los centros de interés me siento seguro(a) y feliz." id="e3" options={["Siempre", "Casi siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="4. En los centros de interés aprendo cosas importantes para mi vida." id="e4" options={["Siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="5. En los centros de interés hay buen trato entre compañeros y profesores." id="e5" options={["Siempre", "Casi siempre", "A veces", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="6. Las actividades tienen que ver con mi barrio o comunidad." id="e6" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="7. Participo activamente en los centros de interés que elijo." id="e7" options={["Siempre", "A veces", "Poco", "Nunca"]} respuestas={r} onCheck={g} />
    <Question label="8. Los centros de interés me hacen sentir más motivado(a) para aprender." id="e8" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="9. Gracias a los centros, he mejorado mis relaciones con otros estudiantes." id="e9" options={["Mucho", "Algo", "Poco", "Nada"]} respuestas={r} onCheck={g} />
    <Question label="10. En general, ¿qué tan bueno es el impacto de los centros para ti?" id="e10" options={["Muy bueno", "Bueno", "Regular", "Malo"]} respuestas={r} onCheck={g} />
    <Question label="11. ¿En la escuela nos dan tiempo y espacio suficiente para los centros?" id="e11" options={["Sí, horario normal", "Sí, otro horario", "Sí, en ambos", "No dan suficiente"]} respuestas={r} onCheck={g} />
    <Question label="12. ¿Afecta negativamente otras materias cuando hacemos los centros?" id="e12" options={["Mucho (me perjudica)", "Algo", "Poco", "Nada (no afecta)"]} respuestas={r} onCheck={g} />
  </>
);

// --- 4. COMPONENTE PRINCIPAL ---
export default function DiagnosticoAutomatizado() {
  const [vista, setVista] = useState<'colegio' | 'inicio' | 'login' | 'encuesta'>('colegio');
  const [instInput, setInstInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [rolSel, setRolSel] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [errorPin, setErrorPin] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [generandoReporte, setGenerandoReporte] = useState(false);

  const guardar = (id: string, valor: any) => setRespuestas(prev => ({ ...prev, [id]: valor }));

  const validarPin = () => {
    if (rolSel && pinInput === ACCESO[rolSel].pin) {
      setVista('encuesta');
      setErrorPin(false); setPinInput("");
    } else { setErrorPin(true); setTimeout(() => setErrorPin(false), 2000); }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    
    const idsOrdenados = ACCESO[rolSel!].ids;
    const arrayRespuestas = idsOrdenados.map((id: string) => {
      const val = respuestas[id];
      return Array.isArray(val) ? val.join(", ") : (val || "");
    });

    try {
      const res = await fetch("/api/guardar", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucion: instInput.toUpperCase(),
          correo: emailInput.toLowerCase(),
          rol: rolSel,
          respuestas: arrayRespuestas
        }),
      });

      if (res.ok) setEnviado(true);
      else {
        const errorData = await res.json();
        alert("ERROR DEL SERVIDOR: " + (errorData.error || "No se pudo guardar"));
      }
    } catch (err: any) {
      alert("ERROR DE RED: " + err.message);
    } finally {
      setEnviando(false);
      window.scrollTo(0,0);
    }
  };

  const dispararReporte = async () => {
    const inst = prompt("Nombre exacto de la institución a reportar:");
    const mail = prompt("Correo donde enviar el PDF:");
    if(!inst || !mail) return;

    setGenerandoReporte(true);
    try {
      const res = await fetch('/api/reporte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreInstitucion: inst, destinoCorreo: mail })
      });
      if(res.ok) alert("¡Reporte generado y enviado con éxito!");
      else alert("No se encontraron datos para esa institución.");
    } catch (e) {
      alert("Error de conexión con el motor de reportes.");
    } finally {
      setGenerandoReporte(false);
    }
  };

  const respondidas = rolSel ? ACCESO[rolSel].ids.filter((id: string) => respuestas[id] && (Array.isArray(respuestas[id]) ? respuestas[id].length > 0 : true)).length : 0;
  const incompleto = rolSel ? respondidas < ACCESO[rolSel].total : true;

  if (vista === 'colegio') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <Card className="max-w-2xl w-full space-y-10 py-16 border-t-[12px] border-[#1e3a8a]">
        <School size={60} className="mx-auto text-[#1e3a8a]" />
        <h1 className="text-4xl font-black text-[#1e3a8a] uppercase italic">Diagnóstico Institucional</h1>
        <div className="space-y-6 max-w-lg mx-auto">
            <input type="text" value={instInput} onChange={(e) => setInstInput(e.target.value)} placeholder="NOMBRE DE LA INSTITUCIÓN..." className="w-full px-6 py-6 rounded-3xl border-4 border-blue-50 focus:border-blue-600 outline-none text-xl font-black text-blue-900 uppercase bg-slate-50" />
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="TU CORREO ELECTRÓNICO..." className="w-full px-6 py-6 rounded-3xl border-4 border-blue-50 focus:border-blue-600 outline-none text-xl font-black text-blue-900 bg-slate-50" />
        </div>
        
        {/* AQUÍ ESTÁ EL CAMBIO SOLICITADO */}
        <div className="flex flex-col items-center gap-6">
          <Button disabled={instInput.trim().length < 5 || !emailInput.includes("@")} onClick={() => setVista('inicio')} className="w-full max-w-xs mx-auto h-20">
            CONTINUAR
          </Button>
          
          <p className="text-lg font-bold text-slate-700 uppercase tracking-tight leading-relaxed">
            PROGRAMA DE TUTORÍAS Y FORMACIÓN INTEGRAL PTA/FI 3.0 <br />
            CDA G9 AVANZANDO - ATLÁNTICO <br />
            LEONARDO OROZCO
          </p>
        </div>
      </Card>
      
      <button 
        onClick={dispararReporte}
        className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-4 rounded-full shadow-2xl opacity-40 hover:opacity-100 transition-all flex items-center gap-3 font-bold"
      >
        {generandoReporte ? <Loader2 className="animate-spin"/> : <FileText size={20}/>}
        {generandoReporte ? "PROCESANDO..." : "GENERAR REPORTE PDF"}
      </button>
    </div>
  );

  if (vista === 'inicio') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-5xl w-full space-y-12">
        <h1 className="text-5xl font-black text-[#1e3a8a] mb-12 uppercase italic tracking-tighter">{instInput}</h1>
        <p className="text-2xl font-bold text-blue-600 uppercase italic">Selecciona tu Rol para comenzar</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <RoleBtn icon={<UserCircle size={56}/>} label="Directivos" onClick={() => {setRolSel('Directivos'); setVista('login')}} color="border-blue-500" />
          <RoleBtn icon={<BookOpen size={56}/>} label="Docentes" onClick={() => {setRolSel('Docentes'); setVista('login')}} color="border-emerald-500" />
          <RoleBtn icon={<Users size={56}/>} label="Padres" onClick={() => {setRolSel('Padres'); setVista('login')}} color="border-orange-500" />
          <RoleBtn icon={<GraduationCap size={56}/>} label="Estudiantes" onClick={() => {setRolSel('Estudiantes'); setVista('login')}} color="border-purple-500" />
        </div>
      </div>
    </div>
  );

  if (vista === 'login') return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full space-y-8">
        <Lock size={40} className="mx-auto text-blue-600"/><h2 className="text-2xl font-black text-[#1e3a8a] uppercase italic">Acceso {rolSel}</h2>
        <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && validarPin()} className={`w-full text-center text-5xl p-6 rounded-3xl border-4 outline-none ${errorPin ? 'border-red-500 bg-red-50 animate-bounce' : 'border-blue-50 focus:border-[#1e3a8a]'}`} placeholder="****" />
        <div className="flex gap-4"><Button variant="ghost" className="flex-1" onClick={() => setVista('inicio')}>ATRÁS</Button><Button className="flex-1" onClick={validarPin}>INGRESAR</Button></div>
      </Card>
    </div>
  );

  if (enviado) return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full py-20 border-t-[16px] border-emerald-500">
        <CheckCircle2 size={120} className="text-emerald-500 mx-auto animate-bounce mb-6" />
        <h2 className="text-4xl font-black text-slate-800 uppercase italic">¡REGISTRO EXITOSO!</h2>
        <p className="text-xl text-slate-500 font-bold mb-8 italic">Muchas gracias por participar.</p>
        <Button className="w-full h-20" onClick={() => window.location.reload()}>FINALIZAR</Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto shadow-2xl rounded-[50px] overflow-hidden bg-white">
        <div className="bg-[#1e3a8a] text-white px-10 py-6 flex justify-between items-center">
            <span className="font-black uppercase tracking-widest">{rolSel} - {instInput}</span>
            <span className="bg-white/20 px-6 py-2 rounded-full text-sm font-bold tracking-tighter">Faltan: {ACCESO[rolSel!].total - respondidas}</span>
        </div>
        <div className="p-12">
          <form onSubmit={manejarEnvio} className="space-y-16">
            {rolSel === 'Directivos' && <FormDirectivos r={respuestas} g={guardar} />}
            {rolSel === 'Docentes' && <FormDocentes r={respuestas} g={guardar} />}
            {rolSel === 'Padres' && <FormPadres r={respuestas} g={guardar} />}
            {rolSel === 'Estudiantes' && <FormEstudiantes r={respuestas} g={guardar} />}
            <div className="pt-12">
              <Button disabled={incompleto || enviando} type="submit" className="w-full h-28 text-3xl uppercase tracking-tighter shadow-2xl">{enviando ? <Loader2 className="animate-spin" size={48} /> : "Finalizar y Enviar"}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function RoleBtn({ icon, label, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`bg-white p-12 rounded-[60px] shadow-lg border-b-[16px] transition-all hover:shadow-2xl hover:-translate-y-4 flex flex-col items-center gap-6 ${color}`}>
      <div className="text-slate-300">{icon}</div>
      <span className="font-black text-slate-700 text-xl uppercase italic tracking-tighter">{label}</span>
    </button>
  );
}