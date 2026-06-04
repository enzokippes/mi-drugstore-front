import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Edit2, Trash2, Package, Tag, Eye, ToggleLeft, ToggleRight, Percent, Star, ChevronDown, AlertTriangle } from 'lucide-react';

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

  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-gray-400 text-sm">{products.length} en catálogo</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 gold-gradient text-gray-950 rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold"
          >
            <Plus size={16} />
            <span className="sm:hidden">Acciones</span>
            <span className="hidden sm:inline">Agregar Producto</span>
            <ChevronDown size={16} className={`sm:hidden transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden">
                <Link
                  to="/products/new"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-gray-800 transition-colors"
                >
                  <Plus size={15} /> Agregar Producto
                </Link>
                <Link
                  to="/categories"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Tag size={15} /> Categorías
                </Link>
                <Link
                  to="/promotions"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Percent size={15} /> Promociones
                </Link>
                <Link
                  to="/"
                  target="_blank"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Eye size={15} /> Ver Tienda
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="glass rounded-xl border border-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gold-500/10">
              <Package className="text-gold-400" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Productos</p>
              <p className="text-xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl border border-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <Tag className="text-blue-400" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Categorías</p>
              <p className="text-xl font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl border border-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="text-yellow-400" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Stock bajo</p>
              <p className="text-xl font-bold text-white">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl border border-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10">
              <Package className="text-red-400" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sin stock</p>
              <p className="text-xl font-bold text-white">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl border border-gray-800/50 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-800/50">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-900/50">
                <th className="px-3 py-3 sm:px-5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Img</th>
                <th className="px-3 py-3 sm:px-5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                <th className="px-3 py-3 sm:px-5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Cat</th>
                <th className="px-3 py-3 sm:px-5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Precio</th>
                {trackInventory && <th className="px-3 py-3 sm:px-5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Stock</th>}
                <th className="px-3 py-3 sm:px-5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Top</th>
                <th className="px-3 py-3 sm:px-5 sm:py-3 text-right text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Acc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={trackInventory ? 7 : 6} className="px-5 py-12 text-center text-gray-600">
                    Sin resultados
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-3 py-3 sm:px-5 sm:py-3">
                      {getImageUrl(product.image) ? (
                        <img src={getImageUrl(product.image)!} alt={product.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-800 flex items-center justify-center text-sm">📦</div>
                      )}
                    </td>
                    <td className="px-3 py-3 sm:px-5 sm:py-3 text-sm font-medium text-white">{product.name}</td>
                    <td className="px-3 py-3 sm:px-5 sm:py-3 text-sm text-gray-400 hidden sm:table-cell">{product.category?.name || '-'}</td>
                    <td className="px-3 py-3 sm:px-5 sm:py-3 text-sm text-gray-300">${product.price.toLocaleString('es-AR')}</td>
                    {trackInventory && <td className="px-3 py-3 sm:px-5 sm:py-3">{getStockBadge(product.stock, product.unlimitedStock)}</td>}
                    <td className="px-3 py-3 sm:px-5 sm:py-3">
                      <button
                        onClick={() => handleToggleFeatured(product.id, !!product.isFeatured)}
                        className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? 'text-gold-400 bg-gold-500/10' : 'text-gray-600 hover:text-gold-400'}`}
                        title={product.isFeatured ? 'Quitar destacado' : 'Marcar destacado'}
                      >
                        <Star size={14} className="sm:w-4 sm:h-4" fill={product.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-3 py-3 sm:px-5 sm:py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/products/edit/${product.id}`} className="p-1.5 sm:p-2 text-gray-500 hover:text-gold-400 rounded-lg hover:bg-gray-800 transition-all">
                          <Edit2 size={14} className="sm:w-4 sm:h-4" />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 sm:p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
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
