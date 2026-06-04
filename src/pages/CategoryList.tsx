import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10">
            <Tag className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Categorías</h1>
            <p className="text-gray-500 text-sm">{categories.length} categorías</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/products" className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-sm">
            ← Volver
          </Link>
          <Link to="/category/new" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
            <Plus className="h-4 w-4" /> Agregar
          </Link>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="glass rounded-xl border border-gray-800/50 p-16 text-center">
          <Tag className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600">No hay categorías</p>
          <Link to="/category/new" className="mt-3 inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300">
            <Plus className="h-4 w-4" /> Crear primera categoría
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="glass rounded-xl border border-gray-800/50 p-4 flex items-center justify-between hover:border-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Tag className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-white font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/category/edit/${category.id}`} className="p-2 text-gray-500 hover:text-green-400 rounded-lg hover:bg-gray-800 transition-all">
                  <Edit2 size={15} />
                </Link>
                <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
