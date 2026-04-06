import { categoriaService } from "@/services/categoriaService";
import { marcaService } from "@/services/marcaService";
import { productoService } from "@/services/productoService";
import { proveedorService } from "@/services/proveedorService";
import ProductoLista from "./ProductoLista";

export default async function ProductosPage() {
    // Obtenemos todos los datos en paralelo para mayor velocidad
    const [productos, categorias, marcas, proveedores] = await Promise.all([
        productoService.listar(),
        categoriaService.listar(),
        marcaService.listar(),
        proveedorService.listar(),
    ]);

    return (
        <div className="max-w-5xl mx-auto">
            <ProductoLista 
                productosInitial={productos} 
                categorias={categorias} 
                marcas={marcas} 
                proveedores={proveedores} 
            />
        </div>
    );
}