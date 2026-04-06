'use client'

import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Truck,
  User,
  Phone,
  Hash
} from 'lucide-react';
import { eliminarProveedorAction, guardarProveedorAction } from '../actions/proveedorActions';

interface Proveedor {
  Id: number;
  Nombre: string;
  IdentificacionFiscal: string | null;
  ContactoNombre: string | null;
  Telefono: string | null;
  Activo: boolean;
}

export default function ProveedorLista({ proveedoresInitial = [] }: { proveedoresInitial: Proveedor[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtrado y Paginación
  const filtered = useMemo(() => {
    return proveedoresInitial.filter(p => 
      p.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.IdentificacionFiscal?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, proveedoresInitial]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleOpenModal = (proveedor: Proveedor | null = null) => {
    setSelectedProveedor(proveedor);
    setIsModalOpen(true);
  };

  const confirmEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar proveedor?',
      text: "Se marcará como inactivo en el sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await eliminarProveedorAction(id);
      toast.success('Proveedor desactivado');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Truck className="text-indigo-600" /> Proveedores
          </h1>
          <p className="text-slate-500 text-sm">Administra tus socios comerciales y contactos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all font-semibold text-sm flex items-center gap-2"
        >
          <Plus size={18} /> Nuevo Proveedor
        </button>
      </div>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre o ID fiscal..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa / ID Fiscal</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((p) => (
              <tr key={p.Id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-700">{p.Nombre}</div>
                  <div className="text-xs text-slate-400 font-medium">{p.IdentificacionFiscal || 'Sin ID Fiscal'}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-600 flex items-center gap-1">
                    <User size={14} className="text-slate-400" /> {p.ContactoNombre || 'N/A'}
                  </div>
                  <div className="text-xs text-indigo-500 font-medium flex items-center gap-1">
                    <Phone size={12} /> {p.Telefono || '---'}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Pencil size={18} /></button>
                    <button onClick={() => confirmEliminar(p.Id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm text-slate-500 font-medium">Página {currentPage} de {totalPages || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-2 border rounded-lg bg-white disabled:opacity-30"><ChevronLeft size={18}/></button>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-2 border rounded-lg bg-white disabled:opacity-30"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* Modal - Grid Layout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <form action={async (formData) => {
                await guardarProveedorAction(formData, selectedProveedor?.Id);
                setIsModalOpen(false);
                toast.success(selectedProveedor ? 'Actualizado' : 'Registrado');
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Empresa</label>
                  <input name="nombre" defaultValue={selectedProveedor?.Nombre} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Hash size={14}/> ID Fiscal</label>
                  <input name="identificacionFiscal" defaultValue={selectedProveedor?.IdentificacionFiscal || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Phone size={14}/> Teléfono</label>
                  <input name="telefono" defaultValue={selectedProveedor?.Telefono || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><User size={14}/> Nombre de Contacto</label>
                  <input name="contactoNombre" defaultValue={selectedProveedor?.ContactoNombre || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  {selectedProveedor ? 'Guardar Cambios' : 'Registrar Proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
