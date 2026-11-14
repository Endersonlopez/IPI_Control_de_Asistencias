import { useState } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Header from '../Dashboard/Header';
import AlumnosList from './AlumnosList';
import AlumnoModal from './AlumnoModal';
import { Smartphone } from 'lucide-react';

export default function Alumnos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  const handleAbrirModal = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setAlumnoSeleccionado(null);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden relative">
        <Header titulo="Alumnos" />

        <div className="flex-1 overflow-auto p-8 flex flex-col gap-6 relative">
          <AlumnosList onVerAlumno={handleAbrirModal} />

          {modalOpen && (
            <AlumnoModal 
              alumno={alumnoSeleccionado} 
              onClose={handleCerrarModal} 
            />
          )}
        </div>        

      </main>
    </div>
  );
}