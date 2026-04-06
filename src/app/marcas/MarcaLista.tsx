'use client'

import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  X, 
  Image as ImageIcon, 
  Search, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { eliminarMarcaAction, guardarMarcaAction } from '../actions/marcaActions';

// 1. Definición de la Interface para TypeScript
interface Marca {
  Id: number;
  Nombre: string;
  LogoUrl: string | null;
  Activa: boolean;
  FechaCreacion: string;
}

export default function MarcaList({ marcasInitial }: { marcasInitial: Marca[] }) {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- LÓGICA DE FILTRADO Y PAGINACIÓN ---
  const filteredMarcas = useMemo(() => {
    return marcasInitial.filter(cat => 
      cat.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, marcasInitial]);

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredMarcas.length / itemsPerPage);
  
  // Manejar la paginación de marcas
  const paginatedMarcas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMarcas.slice(start, start + itemsPerPage);
  }, [filteredMarcas, currentPage]);

  // --- MANEJADORES DE EVENTOS ---
  const handleOpenModal = (Marca: Marca | null = null) => {
    setSelectedMarca(Marca);
    setPreviewUrl(Marca?.LogoUrl || null);
    setIsModalOpen(true);
  };

  // Manejar la búsqueda de marcas
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // Manejar la eliminación de una marca
  const confirmEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: "Esta acción desactivará el registro en el sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      await eliminarMarcaAction(id);
      toast.success('Categoría eliminada correctamente');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Marcas</h1>
          <p className="text-slate-500 text-sm">Gestiona las marcas de tus productos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-all font-semibold text-sm"
        >
          <Plus size={18} /> Nueva Marca
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Marca</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Creación</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMarcas.map((cat) => (
                <tr key={cat.Id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                      {cat.LogoUrl ? (
                        <img src={cat.LogoUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="text-slate-400" size={20} />
                      )}
                    </div>
                    <span className="font-semibold text-slate-700">{cat.Nombre}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(cat.FechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(cat)} 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => confirmEliminar(cat.Id)} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedMarcas.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-400 italic">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500 font-medium">
            Página {currentPage} de {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Creación/Edición */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                {selectedMarca ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Vista Previa de Imagen */}
            <div className="flex justify-center pt-6">
              <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                    onError={() => setPreviewUrl(null)}
                  />
                ) : (
                  <ImageIcon className="text-slate-300" size={32} />
                )}
              </div>
            </div>

            <form action={async (formData) => {
                await guardarMarcaAction(formData, selectedMarca?.Id);
                setIsModalOpen(false);
                toast.success(selectedMarca ? 'Cambios guardados' : 'Categoría creada');
            }} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre</label>
                <input 
                  name="nombre" 
                  defaultValue={selectedMarca?.Nombre} 
                  required 
                  placeholder="Ej. Bebidas"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">URL del Logo</label>
                <input 
                  name="logoUrl" 
                  defaultValue={selectedMarca?.LogoUrl || ''} 
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                >
                  {selectedMarca ? 'Actualizar' : 'Crear Marca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
