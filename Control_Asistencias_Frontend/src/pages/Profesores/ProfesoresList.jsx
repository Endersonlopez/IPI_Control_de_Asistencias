import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, UserX } from 'lucide-react';

export default function ProfesoresList({ profesores = [], onVerProfesor, onEliminarProfesor }) {
  const [busqueda, setBusqueda] = useState('');

  // Filtrado dinámico por nombre, especialidad o departamento
  const profesoresFiltrados = profesores.filter((prof) => {
    const nombreCompleto = `${prof.primer_Nombre || ''} ${prof.primer_Apellido || ''}`.toLowerCase();
    const especialidad = (prof.especialidad || '').toLowerCase();
    const departamento = (prof.departamento || '').toLowerCase();
    const query = busqueda.toLowerCase();

    return (
      nombreCompleto.includes(query) ||
      especialidad.includes(query) ||
      departamento.includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Barra superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar profesor..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-indigo-600 focus:outline-none transition-colors"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button
          onClick={() => onVerProfesor(null)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus size={18} />
          Nuevo Profesor
        </button>
      </div>

      {/* TABLA DE PROFESORES */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Profesor</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profesoresFiltrados.length > 0 ? (
                profesoresFiltrados.map((prof) => (
                  <tr key={prof.id_Profesor} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">
                      {prof.primer_Nombre} {prof.primer_Apellido}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">
                      {prof.especialidad || 'Sin asignar'}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">
                      {prof.departamento || 'Sin asignar'}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onVerProfesor(prof)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onEliminarProfesor(prof.id_Profesor)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserX size={32} className="text-gray-300" />
                      <p className="font-medium text-gray-500">No se encontraron profesores</p>
                      <p className="text-xs text-gray-400">Prueba ajustando el término de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}