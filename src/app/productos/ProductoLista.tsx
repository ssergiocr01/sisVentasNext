'use client'

import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Pencil, Trash2, Plus, X, Search, ChevronLeft, ChevronRight,
  Package, Barcode, DollarSign, Tag, Layers, Truck, Image as ImageIcon
} from 'lucide-react';
import { eliminarProductoAction, guardarProductoAction } from '../actions/productoActions';

// 1. Interface actualizada con ImagenUrl
interface Producto {
  Id: number;
  CodigoBarras: string;
  Nombre: string;
  PrecioCompra: number;
  PrecioVenta: number;
  IvaPorcentaje: number;
  ImagenUrl: string | null;
  MarcaId: number;
  MarcaNombre: string;
  CategoriaId: number;
  CategoriaNombre: string;
  ProveedorId: number;
  ProveedorNombre: string;
}

export default function ProductoLista({ 
  productosInitial = [], 
  categorias = [], 
  marcas = [], 
  proveedores = [] 
}: { 
  productosInitial: Producto[], 
  categorias: any[], 
  marcas: any[], 
  proveedores: any[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Lógica de búsqueda
  const filtered = useMemo(() => {
    return (productosInitial || []).filter(p => 
      p.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.CodigoBarras.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, productosInitial]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleOpenModal = (producto: Producto | null = null) => {
    setSelectedProducto(producto);
    setPreviewUrl(producto?.ImagenUrl || null);
    setIsModalOpen(true);
  };

  const confirmEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: "Esta acción lo desactivará del catálogo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await eliminarProductoAction(id);
      toast.success('Producto eliminado');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="text-indigo-600" /> Inventario de Productos
          </h1>
          <p className="text-slate-500 text-sm">Control de stock, precios y proveedores</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-sm font-semibold text-sm flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre o código de barras..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Precios</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría / Marca</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((p) => (
                <tr key={p.Id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                      {p.ImagenUrl ? (
                        <img src={p.ImagenUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="text-slate-400" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700">{p.Nombre}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Barcode size={12}/> {p.CodigoBarras}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-sm font-semibold text-green-600">${p.PrecioVenta.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400">Costo: ${p.PrecioCompra.toFixed(2)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md inline-block mb-1">{p.CategoriaNombre}</div>
                    <div className="text-[11px] text-slate-500 block">{p.MarcaNombre}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Pencil size={18}/></button>
                      <button onClick={() => confirmEliminar(p.Id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm text-slate-500 font-medium">Página {currentPage} de {totalPages || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-2 border rounded-lg bg-white disabled:opacity-30"><ChevronLeft size={18}/></button>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-2 border rounded-lg bg-white disabled:opacity-30"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* Modal de Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <form action={async (formData) => {
                await guardarProductoAction(formData, selectedProducto?.Id);
                setIsModalOpen(false);
                toast.success(selectedProducto ? 'Producto actualizado' : 'Producto creado');
            }} className="p-6 space-y-5">
              
              {/* Vista previa de imagen */}
              <div className="flex justify-center">
                <div className="h-28 w-28 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" onError={() => setPreviewUrl(null)} />
                  ) : (
                    <ImageIcon className="text-slate-300" size={40} />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto</label>
                  <input name="nombre" defaultValue={selectedProducto?.Nombre} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código de Barras</label>
                  <input name="codigoBarras" defaultValue={selectedProducto?.CodigoBarras} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL Imagen</label>
                  <input name="imagenUrl" defaultValue={selectedProducto?.ImagenUrl || ''} onChange={(e) => setPreviewUrl(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio Compra</label>
                  <input name="precioCompra" type="number" step="0.01" defaultValue={selectedProducto?.PrecioCompra} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio Venta</label>
                  <input name="precioVenta" type="number" step="0.01" defaultValue={selectedProducto?.PrecioVenta} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              {/* Selectores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                  <select name="categoriaId" defaultValue={selectedProducto?.CategoriaId} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Seleccionar...</option>
                    {categorias.map(c => <option key={c.Id} value={c.Id}>{c.Nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Marca</label>
                  <select name="marcaId" defaultValue={selectedProducto?.MarcaId} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Seleccionar...</option>
                    {marcas.map(m => <option key={m.Id} value={m.Id}>{m.Nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proveedor</label>
                  <select name="proveedorId" defaultValue={selectedProducto?.ProveedorId} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Seleccionar...</option>
                    {proveedores.map(p => <option key={p.Id} value={p.Id}>{p.Nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  {selectedProducto ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
