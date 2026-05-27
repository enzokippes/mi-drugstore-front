import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Tag } from 'lucide-react';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          const response = await api.get(`/categories/${id}`);
          setName(response.data.name);
        } catch (error) {
          setError('Error al cargar la categoría.');
        }
      };
      fetchCategory();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/categories/${id}`, { name });
      } else {
        await api.post('/categories', { name });
      }
      navigate('/categories');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/categories" className="text-gray-500 hover:text-green-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Tag className="h-6 w-6 text-green-500" />
        <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Editar Categoría' : 'Crear Categoría'}</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre de la Categoría</label>
            <input type="text" required maxLength={50} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Bebidas, Snacks..." />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/categories')} className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium flex items-center disabled:opacity-50">
              <Save className="h-4 w-4 mr-1.5" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
