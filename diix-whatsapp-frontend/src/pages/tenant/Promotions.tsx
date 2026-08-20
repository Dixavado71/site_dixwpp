import { useState, useEffect } from 'react';
import { tenantService } from '../../services';
import type { Promotion, CreatePromotionDTO, UpdatePromotionDTO } from '../../types';
import TenantLayout from '../../components/layout/TenantLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<CreatePromotionDTO>({
    title: '',
    description: '',
    discount: 0,
    startDate: '',
    endDate: '',
    active: true,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await tenantService.getPromotions(1, 100);
      setPromotions(response.data.items);
      setError(null);
    } catch (err) {
      setError('Failed to load promotions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        title: promotion.title,
        description: promotion.description || '',
        discount: promotion.discount,
        startDate: promotion.startDate.split('T')[0],
        endDate: promotion.endDate.split('T')[0],
        active: promotion.active,
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        title: '',
        description: '',
        discount: 0,
        startDate: '',
        endDate: '',
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromotion) {
        await tenantService.updatePromotion(editingPromotion.id, formData as UpdatePromotionDTO);
      } else {
        await tenantService.createPromotion(formData);
      }
      handleCloseModal();
      loadPromotions();
    } catch (err) {
      setError('Failed to save promotion');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    try {
      await tenantService.deletePromotion(id);
      loadPromotions();
    } catch (err) {
      setError('Failed to delete promotion');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <TenantLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
            <p className="text-gray-600 mt-1">Manage your promotional offers</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary">
            New Promotion
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <Card key={promotion.id}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{promotion.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${promotion.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {promotion.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {promotion.description && (
                <p className="text-gray-600 text-sm mb-4">{promotion.description}</p>
              )}
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Discount:</span> {promotion.discount}%
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Start:</span> {new Date(promotion.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">End:</span> {new Date(promotion.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleOpenModal(promotion)} variant="secondary" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(promotion.id)} variant="danger" size="sm" className="flex-1">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {promotions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No promotions found. Create your first promotion!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingPromotion ? 'Edit Promotion' : 'New Promotion'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" onClick={handleCloseModal} variant="secondary" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  {editingPromotion ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </TenantLayout>
  );
}
