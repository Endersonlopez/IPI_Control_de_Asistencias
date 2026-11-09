import { useState } from 'react';
import { FileSpreadsheet, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export default function AsistenciasList({ asistencias = [], cargando = false, filtros = {} }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const totalRegistros = asistencias.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const asistenciasPaginadas = asistencias.slice(indiceInicio, indiceInicio + registrosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
  };

  const formatearHora = (horaString) => {
    if (!horaString) return '';
    return horaString.substring(0, 5);
  };

  // Obtener texto del retraso
  const obtenerTextoRetraso = (item) => {
    if (item.Retraso || item.retraso) return item.Retraso || item.retraso;
    const mins = item.Minutos_Retraso ?? item.minutos_Retraso ?? item.MinutosRetraso ?? item.minutosRetraso;
    if (mins !== undefined && mins !== null) {
      if (mins < 0) return `${mins} min`;
      if (mins === 0) return 'A tiempo';
      return `+${mins} min`;
    }
    return 'Ninguno';
  };

  const obtenerColorBadge = (codigo) => {
    if (!codigo || codigo === 'N/A') return 'bg-gray-600 text-white';
    const colors = [
      'bg-[#3C31C6]', 'bg-[#5B21B6]', 'bg-[#0D9488]', 'bg-[#059669]',
      'bg-[#D97706]', 'bg-[#C026D3]', 'bg-[#E11D48]', 'bg-[#2563EB]'
    ];
    let hash = 0;
    for (let i = 0; i < codigo.length; i++) {
      hash = codigo.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `${colors[Math.abs(hash) % colors.length]} text-white`;
  };

  const obtenerEstiloEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'presente': return 'bg-emerald-50 text-emerald-600';
      case 'llegada con tolerancia': return 'bg-amber-50 text-amber-600';
      case 'tarde': return 'bg-orange-50 text-orange-600';
      case 'ausente': return 'bg-rose-50 text-rose-600';
      case 'justificado': return 'bg-sky-50 text-sky-600';
      case 'injustificado': return 'bg-rose-50 text-rose-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const exportarExcel = () => {
    const datosExcel = asistencias.map((item, index) => {
      const codigo = item.codigo_Materia || 'N/A';
      const alumno = item.nombre_Alumno || 'Desconocido';
      const clase = item.nombre_Materia || 'Sin Asignar';
      const profesor = item.nombre_Profesor || 'No Asignado';
      const fecha = item.fecha ? formatearFecha(item.fecha) : '';
      const hora = item.hora ? formatearHora(item.hora) : '--:--';
      const ingreso = fecha && hora ? `${fecha} ${hora}` : '--:--';
      const horaClaseInicio = formatearHora(item.hora_Clase_Inicio || item.Hora_Clase_Inicio);
      const horaClaseFin = formatearHora(item.hora_Clase_Fin || item.Hora_Clase_Fin);
      const horaClase = horaClaseInicio && horaClaseFin ? `${horaClaseInicio} - ${horaClaseFin}` : '--:--';
      const estado = item.nombre_Estado_Asistencia || 'Presente';

      return {
        '#': index + 1,
        'Código': codigo,
        'Alumno': alumno,
        'Clase': clase,
        'Profesor': profesor,
        'Ingreso': ingreso,
        'Hora Clase': horaClase,
        'Estado': estado
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const columnWidths = [
      { wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 35 },
      { wch: 30 }, { wch: 25 }, { wch: 20 }, { wch: 15 }
    ];
    worksheet['!cols'] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');
    XLSX.writeFile(workbook, 'reporte_asistencias.xlsx');
    toast.success('Excel exportado exitosamente');
  };

  const exportarPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const colorPrimario = '#3C31C6';
    const colorGrisOscuro = '#505050';
    const colorGrisClaro = '#969696';

    doc.setFontSize(18);
    doc.setTextColor(colorPrimario);
    doc.setFont('Helvetica', 'bold');
    doc.text('Reporte de Asistencias', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(colorGrisClaro);
    doc.setFont('Helvetica', 'normal');
    const fechaGen = new Date().toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Generado: ${fechaGen}`, pageWidth / 2, 28, { align: 'center' });

    let textoRango = 'Mostrando todos los registros';
    const fInicio = filtros?.fechaInicio;
    const fFin = filtros?.fechaFin;
    if (fInicio && fFin) {
      textoRango = `Período: ${formatearFecha(fInicio)} al ${formatearFecha(fFin)}`;
    } else if (fInicio) {
      textoRango = `Desde: ${formatearFecha(fInicio)}`;
    } else if (fFin) {
      textoRango = `Hasta: ${formatearFecha(fFin)}`;
    }
    doc.text(textoRango, pageWidth / 2, 34, { align: 'center' });

    doc.setDrawColor(colorPrimario);
    doc.setLineWidth(0.5);
    doc.line(margin, 38, pageWidth - margin, 38);

    const columnas = [
      { header: '#', dataKey: 'indice' },
      { header: 'Código', dataKey: 'codigo' },
      { header: 'Alumno', dataKey: 'alumno' },
      { header: 'Clase', dataKey: 'clase' },
      { header: 'Profesor', dataKey: 'profesor' },
      { header: 'Ingreso', dataKey: 'ingreso' },
      { header: 'Hora Clase', dataKey: 'horaClase' },
      { header: 'Estado', dataKey: 'estado' }
    ];

    const filas = asistencias.map((item, index) => {
      const codigo = item.codigo_Materia || 'N/A';
      const alumno = item.nombre_Alumno || 'Desconocido';
      const clase = item.nombre_Materia || 'Sin Asignar';
      const profesor = item.nombre_Profesor || 'No Asignado';
      const fecha = item.fecha ? formatearFecha(item.fecha) : '';
      const hora = item.hora ? formatearHora(item.hora) : '--:--';
      const ingreso = fecha && hora ? `${fecha} ${hora}` : '--:--';
      const horaClaseInicio = formatearHora(item.hora_Clase_Inicio || item.Hora_Clase_Inicio);
      const horaClaseFin = formatearHora(item.hora_Clase_Fin || item.Hora_Clase_Fin);
      const horaClase = horaClaseInicio && horaClaseFin ? `${horaClaseInicio} - ${horaClaseFin}` : '--:--';
      const estado = item.nombre_Estado_Asistencia || 'Presente';

      return { indice: index + 1, codigo, alumno, clase, profesor, ingreso, horaClase, estado };
    });

    autoTable(doc, {
      columns: columnas,
      body: filas,
      startY: 42,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, textColor: colorGrisOscuro, valign: 'middle' },
      columnStyles: {
        indice: { halign: 'center', cellWidth: 8 },
        codigo: { halign: 'center' },
        alumno: { halign: 'left' },
        clase: { halign: 'left' },
        profesor: { halign: 'left' },
        ingreso: { halign: 'center', cellWidth: 28 },
        horaClase: { halign: 'center', cellWidth: 22 },
        estado: { halign: 'center' }
      },
      headStyles: { fillColor: colorPrimario, textColor: '#ffffff', fontStyle: 'bold', fontSize: 8.5 },
      alternateRowStyles: { fillColor: '#f8f8ff' },
      margin: { left: margin, right: margin }
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(colorGrisClaro);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    doc.save('reporte_asistencias.pdf');
    toast.success('PDF exportado exitosamente');
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm min-h-[580px]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 bg-white">
        <p className="text-xs text-gray-500">
          Mostrando <span className="font-bold text-gray-800">{totalRegistros}</span> registros
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button onClick={exportarExcel} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <FileSpreadsheet size={15} className="text-emerald-600" /> Excel
          </button>
          <button onClick={exportarPDF} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <FileText size={15} className="text-red-500" /> PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-[#3C31C6] text-white">
            <tr>
              <th className="px-4 py-3.5 font-semibold text-center">#</th>
              <th className="px-6 py-3.5 font-semibold">Código</th>
              <th className="px-6 py-3.5 font-semibold">Alumno</th>
              <th className="px-6 py-3.5 font-semibold">Clase</th>
              <th className="px-6 py-3.5 font-semibold">Profesor</th>
              <th className="px-6 py-3.5 font-semibold">Ingreso</th>
              <th className="px-6 py-3.5 font-semibold">Hora Clase</th>
              <th className="px-6 py-3.5 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargando ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-5 w-8 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-5 w-12 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-5 w-28 bg-gray-200 rounded-full"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full"></div></td>
                </tr>
              ))
            ) : asistenciasPaginadas.length > 0 ? (
              asistenciasPaginadas.map((item, index) => {
                const idAsistencia = item.id_Asistencia ?? item.Id_Asistencia ?? item.idAsistencia ?? index;
                const codigoMateria = item.codigo_Materia ?? item.Codigo_Materia ?? item.codigoMateria ?? 'N/A';
                const nombreAlumno = item.nombre_Alumno ?? item.Nombre_Alumno ?? item.nombreAlumno ?? 'Desconocido';
                const nombreMateria = item.nombre_Materia ?? item.Nombre_Materia ?? item.nombreMateria ?? 'Sin Asignar';
                const nombreProfesor = item.nombre_Profesor ?? item.Nombre_Profesor ?? item.nombreProfesor ?? 'No Asignado';
                const fecha = item.fecha ?? item.Fecha;
                const hora = item.hora ?? item.Hora;
                const horaClaseInicio = item.hora_Clase_Inicio ?? item.Hora_Clase_Inicio ?? item.horaClaseInicio;
                const horaClaseFin = item.hora_Clase_Fin ?? item.Hora_Clase_Fin ?? item.horaClaseFin;
                const estadoAsistencia = item.nombre_Estado_Asistencia ?? item.Nombre_Estado_Asistencia ?? item.nombreEstadoAsistencia ?? 'Presente';
                const esAusente = item.EsAusente === 1 || estadoAsistencia === 'Ausente';

                const idEstadoAlumno = item.idEstadoAlumno ?? item.id_Estado_Alumno ?? item.Id_Estado_Alumno ?? item.IdEstadoAlumno ?? 1;
                const esAlumnoInactivo = Number(idEstadoAlumno) !== 1;

                const numeroFila = (paginaActual - 1) * registrosPorPagina + index + 1;

                return (
                  <tr key={`${idAsistencia}-${index}`} className={`hover:bg-gray-50/80 transition-colors ${esAusente ? 'bg-rose-50/50' : ''}`}>
                    <td className="px-4 py-3.5 text-center font-mono text-gray-500">{numeroFila}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold ${obtenerColorBadge(codigoMateria)}`}>
                        {codigoMateria}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-800">
                      <span className={esAlumnoInactivo ? 'text-gray-400 line-through' : ''}>{nombreAlumno}</span>
                      {esAlumnoInactivo && (
                        <span className="ml-2 inline-block rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200/60">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">{nombreMateria}</span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{nombreProfesor}</td>
                    <td className="px-6 py-3.5">
                      {esAusente ? (
                        <span className="text-gray-400 italic">--:--</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{formatearFecha(fecha)}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[11px] text-gray-500">{formatearHora(hora)}</span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-gray-700">
                      {horaClaseInicio && horaClaseFin ? `${formatearHora(horaClaseInicio)} - ${formatearHora(horaClaseFin)}` : <span className="text-gray-400 italic">--:--</span>}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${obtenerEstiloEstado(estadoAsistencia)}`}>
                        {estadoAsistencia}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">No hay asistencias registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!cargando && totalRegistros > 0 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-500">
            Página <span className="font-semibold text-gray-800">{paginaActual}</span> de <span className="font-semibold text-gray-800">{totalPaginas}</span>
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="flex items-center justify-center p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-2 text-gray-700">{paginaActual} / {totalPaginas}</span>
            <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="flex items-center justify-center p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}