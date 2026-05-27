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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Categorías</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
            Volver
          </Link>
          <Link to="/category/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors text-sm font-medium">
            <Plus className="h-4 w-4 mr-1.5" /> Agregar
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-gray-600">No hay categorías</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-white">{category.name}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/category/edit/${category.id}`} className="p-2 text-gray-500 hover:text-green-400 rounded-lg hover:bg-gray-800 transition-all">
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
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
  );
};

export default CategoryList;
