import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Edit2, Trash2, Package, Tag, Eye, ToggleLeft, ToggleRight, Percent, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unlimitedStock: boolean;
  image?: string;
  isFeatured?: boolean;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [trackInventory, setTrackInventory] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/settings'),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      const settings = settingsRes.data;
      if (settings.trackInventory !== undefined) {
        setTrackInventory(settings.trackInventory === 'true');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleInventory() {
    const newValue = !trackInventory;
    setTrackInventory(newValue);
    try {
      await api.put('/settings', { key: 'trackInventory', value: String(newValue) });
    } catch (error) {
      console.error('Error updating setting:', error);
      setTrackInventory(!newValue);
    }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    try {
      await api.put(`/products/${id}`, { isFeatured: !current });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !current } : p));
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Estas seguro de que deseas eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  const filtered = products.filter((p) => {
    const term = search.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.category?.name.toLowerCase().includes(term);
  });

  const lowStockCount = products.filter((p) => !p.unlimitedStock && p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => !p.unlimitedStock && p.stock === 0).length;

  function getImageUrl(image?: string) {
    if (!image) return null;
    if (image.startsWith('/uploads')) return `${(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000')}${image}`;
    return image;
  }

  function getStockBadge(stock: number, unlimitedStock: boolean) {
    if (unlimitedStock) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400">Ilimitado</span>;
    if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400">0</span>;
    if (stock <= 10) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gold-900/50 text-gold-400">{stock}</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400">{stock}</span>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion de Productos</h1>
          <p className="text-gray-400">Administra tu catalogo</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/products/new" className="inline-flex items-center gap-2 px-4 py-2 gold-gradient text-gray-950 rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold">
            <Plus size={16} /> Agregar Producto
          </Link>
          <Link to="/categories" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
            <Tag size={16} /> Categorias
          </Link>
          <Link to="/promotions" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
            <Percent size={16} /> Promociones
          </Link>
          <Link to="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
            <Eye size={16} /> Ver Tienda
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl border border-gray-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gold-500/10">
              <Package className="text-gold-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Productos</p>
              <p className="text-xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl border border-gray-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <Tag className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Categorias</p>
              <p className="text-xl font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl border border-gray-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gold-500/10">
              <Package className="text-gold-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Stock Bajo</p>
              <p className="text-xl font-bold text-white">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl border border-gray-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10">
              <Package className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Sin Stock</p>
              <p className="text-xl font-bold text-white">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl border border-gray-800/50 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {trackInventory ? (
              <ToggleRight size={28} className="text-gold-400 cursor-pointer" onClick={handleToggleInventory} />
            ) : (
              <ToggleLeft size={28} className="text-gray-600 cursor-pointer" onClick={handleToggleInventory} />
            )}
            <div>
              <p className="font-medium text-white text-sm">Controlar inventario</p>
              <p className="text-xs text-gray-500">{trackInventory ? 'Inventario activado' : 'Inventario desactivado - stock ilimitado'}</p>
            </div>
          </div>
          <button onClick={handleToggleInventory} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${trackInventory ? 'bg-gold-900/30 text-gold-400 hover:bg-gold-900/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {trackInventory ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>

      <div className="glass rounded-xl border border-gray-800/50">
        <div className="p-4 border-b border-gray-800/50">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Imagen</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Precio</th>
                {trackInventory && <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>}
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Destacado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={trackInventory ? 7 : 6} className="px-5 py-12 text-center text-gray-600">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3">
                      {getImageUrl(product.image) ? (
                        <img src={getImageUrl(product.image)!} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">📦</div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-white">{product.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{product.category?.name || '-'}</td>
                    <td className="px-5 py-3 text-sm text-gray-300">${product.price.toLocaleString('es-AR')}</td>
                    {trackInventory && <td className="px-5 py-3">{getStockBadge(product.stock, product.unlimitedStock)}</td>}
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleFeatured(product.id, !!product.isFeatured)}
                        className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? 'text-gold-400 bg-gold-500/10' : 'text-gray-600 hover:text-gold-400'}`}
                        title={product.isFeatured ? 'Quitar de destacados' : 'Marcar como destacado'}
                      >
                        <Star size={16} fill={product.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/products/edit/${product.id}`} className="p-2 text-gray-500 hover:text-gold-400 rounded-lg hover:bg-gray-800 transition-all">
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
