import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Image, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ name: '', price: '', stock: '', categoryId: '', unlimitedStock: false, isCombo: false });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        if (!isEditMode && response.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${id}`);
          const { name, price, stock, categoryId, unlimitedStock, image, isCombo } = response.data;
          setFormData({ name, price: price.toString(), stock: stock.toString(), categoryId, unlimitedStock: unlimitedStock || false, isCombo: isCombo || false });
          if (image) setExistingImage(image);
        } catch (error) {
          setError('Error al cargar el producto.');
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('categoryId', formData.categoryId);
    submitData.append('unlimitedStock', String(formData.unlimitedStock));
    submitData.append('isCombo', String(formData.isCombo));
    submitData.append('stock', formData.unlimitedStock ? '0' : formData.stock);
    if (imageFile) submitData.append('image', imageFile);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditMode) {
        await api.put(`/products/${id}`, submitData, config);
      } else {
        await api.post('/products', submitData, config);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/dashboard" className="text-gray-500 hover:text-green-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Editar Producto' : 'Crear Producto'}</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre del Producto</label>
            <input type="text" name="name" required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Imagen</label>
            {(imagePreview || existingImage) ? (
              <div className="relative inline-block">
                <img src={imagePreview || (existingImage?.startsWith('http') ? existingImage : `${(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000')}${existingImage}`)} alt="Preview" className="w-28 h-28 object-cover rounded-xl border border-gray-700" />
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-green-600 transition-colors bg-gray-800/50">
                <Image className="h-7 w-7 text-gray-600 mb-1.5" />
                <span className="text-xs text-gray-500">Click para subir imagen</span>
                <span className="text-xs text-gray-600 mt-0.5">JPEG, PNG, WebP (max 5MB)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Precio ($)</label>
              <input type="number" name="price" step="0.01" min="0" required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={formData.price} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Categoría</label>
              {loadingCategories ? (
                <div className="w-full h-10 bg-gray-800 animate-pulse rounded-xl" />
              ) : (
                <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm">
                  <option value="" disabled>Seleccioná</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-700/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="unlimitedStock" checked={formData.unlimitedStock} onChange={handleCheckboxChange} className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500" />
              <span className="text-sm font-medium text-gray-300">Stock ilimitado</span>
            </label>
            {!formData.unlimitedStock && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Stock</label>
                <input type="number" name="stock" min="0" required={!formData.unlimitedStock} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={formData.stock} onChange={handleChange} />
              </div>
            )}
            {formData.unlimitedStock && <p className="text-xs text-green-500">Este producto siempre estará disponible.</p>}

            <div className="border-t border-gray-700/50 pt-3 mt-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isCombo" checked={formData.isCombo} onChange={handleCheckboxChange} className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500" />
                <span className="text-sm font-medium text-gray-300">Marcar como Combo 🔥</span>
              </label>
              {formData.isCombo && <p className="text-xs text-yellow-500 mt-1">Este producto aparecerá en la sección Combos del menú principal.</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2 gap-3">
            <button type="button" onClick={() => navigate('/dashboard')} className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">
              Cancelar
            </button>
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

export default ProductForm;
