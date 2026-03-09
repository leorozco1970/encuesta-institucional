import React, { useState } from 'react';

export default function Encuesta() {
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({
    institucion: '',
    correo: '',
    rol: '',
    respuestas: new Array(12).fill('') // Para las 12 preguntas
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (index: number, value: string) => {
    const nuevasRespuestas = [...formData.respuestas];
    nuevasRespuestas[index] = value;
    setFormData({ ...formData, respuestas: nuevasRespuestas });
  };

  const enviarADatos = async () => {
    setEnviando(true);
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("¡Datos guardados correctamente!");
        setPaso(3); // Ir a pantalla de éxito
      } else {
        const errorData = await res.json();
        alert("Error al guardar: " + errorData.details);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
    setEnviando(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Diagnóstico Institucional</h1>
      
      {paso === 1 && (
        <div>
          <input name="institucion" placeholder="Institución" onChange={handleInputChange} /><br/><br/>
          <input name="correo" placeholder="Correo" onChange={handleInputChange} /><br/><br/>
          <select name="rol" onChange={handleInputChange}>
            <option value="">Seleccione Rol</option>
            <option value="Docente">Docente</option>
            <option value="Directivo">Directivo</option>
          </select><br/><br/>
          <button onClick={() => setPaso(2)}>Siguiente</button>
        </div>
      )}

      {paso === 2 && (
        <div>
          <p>¿Cómo califica el clima institucional? (Ejemplo Pregunta 1)</p>
          {[1, 2, 3, 4, 5].map(num => (
            <label key={num}>
              <input type="radio" name="p1" onChange={() => handleRadioChange(0, num.toString())} /> {num}
            </label>
          ))}
          <br/><br/>
          <button onClick={enviarADatos} disabled={enviando}>
            {enviando ? 'Guardando...' : 'Finalizar y Guardar'}
          </button>
        </div>
      )}

      {paso === 3 && <h2>¡Gracias por participar! Revisa tu Excel.</h2>}
    </div>
  );
}