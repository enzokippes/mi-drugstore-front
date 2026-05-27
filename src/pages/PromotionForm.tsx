import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Image, X } from 'lucide-react';

const PromotionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchPromo = async () => {
        try {
          const response = await api.get(`/promotions/${id}`);
          const { title, description, price, originalPrice, active, image } = response.data;
          setFormData({
            title,
            description,
            price: price.toString(),
            originalPrice: originalPrice ? originalPrice.toString() : '',
            active: active ?? true,
          });
          if (image) setExistingImage(image);
        } catch {
          setError('Error al cargar la promoción.');
        }
      };
      fetchPromo();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    if (formData.originalPrice) submitData.append('originalPrice', formData.originalPrice);
    submitData.append('active', String(formData.active));
    if (imageFile) submitData.append('image', imageFile);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditMode) {
        await api.put(`/promotions/${id}`, submitData, config);
      } else {
        await api.post('/promotions', submitData, config);
      }
      navigate('/promotions');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al guardar la promoción.');
    } finally {
      setLoading(false);
    }
  };

  function getPreviewSrc() {
    if (imagePreview) return imagePreview;
    if (existingImage) {
      if (existingImage.startsWith('http')) return existingImage;
      return `${(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000')}${existingImage}`;
    }
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/promotions" className="text-gray-500 hover:text-yellow-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Editar Promoción' : 'Crear Promoción'}</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Título</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Ej: 2x1 en Cervezas"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Descripción</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Ej: Llevate 2 cervezas Quilmes por el precio de 1. Válido viernes y sábados."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm resize-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Imagen</label>
            {getPreviewSrc() ? (
              <div className="relative inline-block">
                <img src={getPreviewSrc()!} alt="Preview" className="w-40 h-28 object-cover rounded-xl border border-gray-700" />
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-yellow-500 transition-colors bg-gray-800/50">
                <Image className="h-7 w-7 text-gray-600 mb-1.5" />
                <span className="text-xs text-gray-500">Click para subir imagen</span>
                <span className="text-xs text-gray-600 mt-0.5">JPEG, PNG, WebP (max 5MB)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Precio Promo ($)</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Precio Original ($) <span className="text-gray-600">opcional</span></label>
              <input
                type="number"
                name="originalPrice"
                step="0.01"
                min="0"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-300">Promoción activa</span>
                <p className="text-xs text-gray-500">Si está activa, aparecerá en la tienda y el banner</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2 gap-3">
            <button type="button" onClick={() => navigate('/promotions')} className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="bg-yellow-500 text-black px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors text-sm font-medium flex items-center disabled:opacity-50">
              <Save className="h-4 w-4 mr-1.5" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionForm;
