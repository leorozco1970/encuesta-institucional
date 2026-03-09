import React, { useState } from 'react';
import { 
  UserCircle, Users, BookOpen, GraduationCap, Lock, 
  ArrowLeft, CheckCircle2, BarChart3, Activity, 
  AlertCircle, Check, Loader2, School, ChevronRight, Keyboard, Mail
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// --- 1. CONFIGURACIÓN DE SEGURIDAD ---
const ACCESO: any = {
  Directivos: { pin: "1111", total: 12, ids: ['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12'] },
  Docentes: { pin: "2222", total: 12, ids: ['doc1','doc2','doc3','doc4','doc5','doc6','doc7','doc8','doc9','doc10','doc11','doc12'] },
  Padres: { pin: "3333", total: 10, ids: ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10'] },
  Estudiantes: { pin: "4444", total: 12, ids: ['e1','e2','e3','e4','e5','e6','e7','e8','e9','e10','e11','e12'] },
  Admin: { pin: "0000" }
};

// --- 2. COMPONENTES BASE ---
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }: any) => {
  const variants: any = {
    primary: disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-xl transform hover:scale-[1.02]",
    outline: "border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 border-dashed",
    ghost: "text-gray-500 hover:bg-gray-100 font-bold"
  };
  return (
    <button disabled={disabled} type={type} onClick={onClick} className={`px-8 py-5 rounded-3xl font-black transition-all flex items-center justify-center gap-3 tracking-tight ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- 3. SUBCOMPONENTES DE PREGUNTA ---
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
      <p className="text-2xl font-black text-slate-800 leading-tight">{label} * <span className="block text-blue-600 text-sm uppercase font-black mt-2">Máximo 3</span></p>
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

// --- 4. FORMULARIOS (12 PREGUNTAS POR ROL) ---
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
    <MultiSelect label="6. ¿En qué ha notado mayor cambio positivo en su hijo(a)?" id="p6" options={["Manejo emociones", "Comportamiento", "Responsabilidad", "Motivación estudiar", "Relaciones sociales", "Habilidades creativas"]} respuestas={r} onCheck={g} />
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
    <Question label="12. ¿Afecta negativamente otras materias cuando hacemos los centros?" id="e12" options={["Mucho (me perjudica)", "Algo", "Poco", "Nada (not afecta)"]} respuestas={r} onCheck={g} />
  </>
);

// --- 5. COMPONENTE PRINCIPAL ---
export default function DiagnosticoAutomatizado() {
  const [vista, setVista] = useState<'colegio' | 'inicio' | 'login' | 'encuesta' | 'dashboard'>('colegio');
  const [instInput, setInstInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [rolSel, setRolSel] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [errorPin, setErrorPin] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const guardar = (id: string, valor: any) => setRespuestas(prev => ({ ...prev, [id]: valor }));

  const validarPin = () => {
    if (rolSel && pinInput === ACCESO[rolSel].pin) {
      setVista(rolSel === 'Admin' ? 'dashboard' : 'encuesta');
      setErrorPin(false); setPinInput("");
    } else { setErrorPin(true); setTimeout(() => setErrorPin(false), 2000); }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    
    // Convertimos el objeto de respuestas en un array ordenado para el Excel
    const idsOrdenados = ACCESO[rolSel!].ids;
    const arrayRespuestas = idsOrdenados.map((id: string) => {
      const val = respuestas[id];
      return Array.isArray(val) ? val.join(", ") : val;
    });

    try {
      const response = await fetch("/api/save", { // LLAMADA A TU API DE GOOGLE
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucion: instInput.toUpperCase(),
          correo: emailInput.toLowerCase(),
          rol: rolSel,
          respuestas: arrayRespuestas
        }),
      });

      // También enviamos a Make por si quieres mantener ambos
      await fetch("https://hook.us2.make.com/cwetc1ylcf4utmi1tqzk2nslpign89a8", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: new Date().toLocaleString('es-CO'),
          institucion: instInput.toUpperCase(),
          email: emailInput.toLowerCase(),
          rol: rolSel,
          datos: respuestas
        }),
      });

      if (response.ok) { 
        setEnviado(true); 
        window.scrollTo(0,0); 
      } else {
        throw new Error();
      }
    } catch { 
      alert("Error al guardar. Verifica tu conexión."); 
    } finally { 
      setEnviando(false); 
    }
  };

  const respondidas = rolSel && rolSel !== 'Admin' ? ACCESO[rolSel].ids.filter((id: string) => respuestas[id] && (Array.isArray(respuestas[id]) ? respuestas[id].length > 0 : true)).length : 0;
  const incompleto = rolSel && rolSel !== 'Admin' ? respondidas < ACCESO[rolSel].total : true;

  const emailValido = emailInput.includes("@") && emailInput.includes(".");

  // --- VISTA 0: IDENTIFICACIÓN ---
  if (vista === 'colegio') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <Card className="max-w-2xl w-full space-y-10 py-16 border-t-[12px] border-[#1e3a8a]">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#1e3a8a]"><School size={50} /></div>
        <div className="space-y-4">
            <h1 className="text-4xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">Diagnóstico Participativo</h1>
            <p className="text-xl font-bold text-slate-400 italic">Bienvenido, por favor identifica tu escuela y contacto:</p>
        </div>
        
        <div className="space-y-6 max-w-lg mx-auto">
            <div className="relative">
                <Keyboard className="absolute left-5 top-6 text-blue-300" size={24} />
                <input type="text" value={instInput} onChange={(e) => setInstInput(e.target.value)} placeholder="NOMBRE DE LA INSTITUCIÓN..." className="w-full pl-14 pr-6 py-6 rounded-3xl border-4 border-blue-50 focus:border-blue-600 outline-none text-xl font-black text-blue-900 uppercase transition-all shadow-inner bg-slate-50" />
            </div>

            <div className="relative">
                <Mail className="absolute left-5 top-6 text-blue-300" size={24} />
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="CORREO ELECTRÓNICO INSTITUCIONAL..." className="w-full pl-14 pr-6 py-6 rounded-3xl border-4 border-blue-50 focus:border-blue-600 outline-none text-xl font-black text-blue-900 transition-all shadow-inner bg-slate-50" />
            </div>
        </div>

        <Button 
            disabled={instInput.trim().length < 5 || !emailValido} 
            onClick={() => setVista('inicio')} 
            className="w-full max-w-xs mx-auto h-20 text-xl"
        >
            CONTINUAR <ChevronRight size={24} />
        </Button>
        <div className="pt-4">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tutorías para el Aprendizaje 3.0</p>
            <p className="text-[10px] text-[#1e3a8a] font-black uppercase tracking-[0.2em] mt-1">CDA G9 ATLANTICO</p>
        </div>
      </Card>
    </div>
  );

  // --- VISTA 1: SELECCIÓN DE ROL ---
  if (vista === 'inicio') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-5xl w-full space-y-12">
        <header className="space-y-4">
          <div className="bg-[#1e3a8a] text-white px-10 py-3 rounded-full inline-flex flex-col items-center shadow-lg italic">
            <span className="font-black uppercase tracking-widest text-lg">{instInput}</span>
            <span className="text-xs text-blue-200 font-bold">{emailInput}</span>
          </div>
          <h1 className="text-6xl font-black text-[#1e3a8a] tracking-tighter uppercase leading-tight">Impacto de los Centros de Interés</h1>
          <p className="text-2xl font-bold text-blue-600 uppercase tracking-widest italic underline decoration-blue-200">Selecciona tu Rol</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <RoleBtn icon={<UserCircle size={56}/>} label="Directivos" onClick={() => {setRolSel('Directivos'); setVista('login')}} color="border-blue-500" />
          <RoleBtn icon={<BookOpen size={56}/>} label="Docentes" onClick={() => {setRolSel('Docentes'); setVista('login')}} color="border-emerald-500" />
          <RoleBtn icon={<Users size={56}/>} label="Padres" onClick={() => {setRolSel('Padres'); setVista('login')}} color="border-orange-500" />
          <RoleBtn icon={<GraduationCap size={56}/>} label="Estudiantes" onClick={() => {setRolSel('Estudiantes'); setVista('login')}} color="border-purple-500" />
        </div>
        <div className="pt-12 flex flex-col items-center gap-6">
          <Button variant="outline" onClick={() => {setRolSel('Admin'); setVista('login')}}><BarChart3 size={24}/> PANEL ADMINISTRADOR</Button>
          <Button variant="ghost" onClick={() => setVista('colegio')}>← VOLVER / CAMBIAR DATOS</Button>
        </div>
      </div>
    </div>
  );

  // --- VISTA 2: LOGIN ---
  if (vista === 'login') return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full space-y-8">
        <Lock size={40} className="mx-auto text-blue-600"/><h2 className="text-2xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">Acceso {rolSel}</h2>
        <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && validarPin()} className={`w-full text-center text-5xl p-6 rounded-3xl border-4 outline-none ${errorPin ? 'border-red-500 bg-red-50 animate-bounce' : 'border-blue-50 focus:border-[#1e3a8a]'}`} placeholder="****" />
        <div className="flex gap-4"><Button variant="ghost" className="flex-1" onClick={() => {setVista('inicio'); setPinInput("");}}>ATRÁS</Button><Button className="flex-1" onClick={validarPin}>INGRESAR</Button></div>
      </Card>
    </div>
  );

  // --- VISTA 3: DASHBOARD ---
  if (vista === 'dashboard') return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => setVista('inicio')} className="mb-6 font-black uppercase"><ArrowLeft size={18}/> SALIR</Button>
        <Card className="p-12"><h2 className="text-4xl font-black text-[#1e3a8a] mb-10 text-center uppercase tracking-tighter italic">Triangulación de Resultados</h2>
          <div className="h-[550px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{tema:'CRESE',Directivos:80,Docentes:70,Padres:90,Estudiantes:85},{tema:'Convivencia',Directivos:75,Docentes:85,Padres:60,Estudiantes:95},{tema:'Motivación',Directivos:95,Docentes:80,Padres:88,Estudiantes:92},{tema:'Contexto',Directivos:70,Docentes:75,Padres:55,Estudiantes:80}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="tema" tick={{fontWeight: 'bold'}} /><YAxis /><Tooltip cursor={{fill: '#f1f5f9'}} /><Legend iconType="circle" />
                <Bar dataKey="Directivos" fill="#3b82f6" radius={[6, 6, 0, 0]} /><Bar dataKey="Docentes" fill="#10b981" radius={[6, 6, 0, 0]} /><Bar dataKey="Padres" fill="#f59e0b" radius={[6, 6, 0, 0]} /><Bar dataKey="Estudiantes" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  // --- VISTA 4: ÉXITO ---
  if (enviado) return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full py-20 border-t-[16px] border-emerald-500">
        <CheckCircle2 size={120} className="text-emerald-500 mx-auto animate-bounce" />
        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">¡Envío Exitoso!</h2>
        <p className="text-xl text-slate-500 font-bold px-4 tracking-tighter italic">Tus datos han sido registrados. El informe será enviado al correo: {emailInput}</p>
        <Button className="w-full h-20 text-xl shadow-2xl" onClick={() => window.location.reload()}>FINALIZAR Y SALIR</Button>
      </Card>
    </div>
  );

  // --- VISTA 5: ENCUESTA ---
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto shadow-2xl rounded-[50px] overflow-hidden">
        <div className="bg-[#1e3a8a] text-white px-10 py-6 flex justify-between items-center border-b-4 border-blue-400">
            <div className="flex flex-col font-black">
                <span className="uppercase italic tracking-widest">{rolSel}</span>
                <span className="text-xs text-blue-200 uppercase">{instInput}</span>
            </div>
            <span className="bg-white/20 px-6 py-2 rounded-full text-sm font-bold tracking-tighter">Faltan: {ACCESO[rolSel!].total - respondidas}</span>
        </div>
        <Card className="rounded-t-none p-12">
          <form onSubmit={manejarEnvio} className="space-y-16">
            {rolSel === 'Directivos' && <FormDirectivos r={respuestas} g={guardar} />}
            {rolSel === 'Docentes' && <FormDocentes r={respuestas} g={guardar} />}
            {rolSel === 'Padres' && <FormPadres r={respuestas} g={guardar} />}
            {rolSel === 'Estudiantes' && <FormEstudiantes r={respuestas} g={guardar} />}
            <div className="pt-12 border-t-8 border-slate-50">
              {incompleto && <div className="text-center text-orange-600 font-black mb-8 animate-pulse uppercase"><AlertCircle size={24}/> Completa todo para enviar (*)</div>}
              <Button disabled={incompleto || enviando} type="submit" className="w-full h-28 text-3xl uppercase tracking-tighter shadow-2xl">{enviando ? <Loader2 className="animate-spin" size={48} /> : "Finalizar y Enviar"}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function RoleBtn({ icon, label, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`bg-white p-12 rounded-[60px] shadow-lg border-b-[16px] transition-all hover:shadow-2xl hover:-translate-y-4 flex flex-col items-center gap-6 ${color}`}>
      <div className="text-slate-300 transition-colors">{icon}</div>
      <span className="font-black text-slate-700 text-xl uppercase italic tracking-tighter">{label}</span>
    </button>
  );
}