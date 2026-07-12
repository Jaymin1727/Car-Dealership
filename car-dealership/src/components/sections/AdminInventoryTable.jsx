import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Save, X, AlertTriangle, Package, Plus } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import styles from '../../styles/sections/AdminInventoryTable.module.css';


const CATEGORIES = ['Coupe', 'Sedan', 'SUV', 'Sports', 'Electric', 'Luxury', 'Convertible'];
const FUELS = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'DCT', 'CVT'];

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags.split(',').map((t) => t.trim()).filter(Boolean);
}

export default function AdminInventoryTable() {
  const { vehicles, updateVehicle, deleteVehicle, addVehicle, setAdminDrawer, showToast } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setEditForm({
      name: vehicle.name || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      price: vehicle.price || '',
      stock: vehicle.stock || 0,
      maxStock: vehicle.maxStock || vehicle.stock || 0,
      horsepower: vehicle.horsepower || '',
      category: vehicle.category || '',
      fuel: vehicle.fuel || '',
      transmission: vehicle.transmission || '',
      acceleration: vehicle.acceleration || '',
      featured: vehicle.featured || false,
      image: vehicle.image || '',
    });
    setDeletingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (vehicle) => {
    setSaving(true);
    await updateVehicle({
      ...vehicle,
      ...editForm,
      price: Number(editForm.price),
      stock: Number(editForm.stock),
      maxStock: Number(editForm.maxStock),
      horsepower: Number(editForm.horsepower),
    });
    setSaving(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    await deleteVehicle(id);
    setDeleting(false);
    setDeletingId(null);
  };

  const textField = (key, type = 'text', extra = {}) => (
    <input
      type={type}
      className={styles.editInput}
      value={editForm[key] ?? ''}
      onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
      {...extra}
    />
  );

  const selectField = (key, options) => (
    <select
      className={styles.editInput}
      value={editForm[key] ?? ''}
      onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.eyebrow}>Fleet Management</div>
          <h2 className={styles.title}>Vehicle Inventory</h2>
        </div>
        <motion.button
          className={styles.addBtn}
          onClick={() => setAdminDrawer(true)}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          id="admin-add-vehicle-btn"
        >
          <Plus size={16} />
          Add Vehicle
        </motion.button>
      </div>

      {vehicles.length === 0 ? (
        <div className={styles.empty}>
          <Package size={36} className={styles.emptyIcon} />
          <p>No vehicles in inventory yet.</p>
          <button className={styles.addBtn} onClick={() => setAdminDrawer(true)}>
            <Plus size={16} /> Add your first vehicle
          </button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>HP</th>
                <th>Fuel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, idx) => {
                const isEditing = editingId === vehicle.id;
                const isDeleting = deletingId === vehicle.id;
                const tags = normalizeTags(vehicle.tags);

                return (
                  <AnimatePresence key={vehicle.id} mode="wait">
                    {isEditing ? (
                      <motion.tr
                        key="edit"
                        className={styles.editRow}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.22 }}
                      >
                        <td colSpan={7}>
                          <div className={styles.editPanel}>
                            <div className={styles.editPanelHeader}>
                              <span className={styles.editPanelTitle}>
                                Editing: <strong>{vehicle.name}</strong>
                              </span>
                              <button className={styles.iconBtn} onClick={cancelEdit}>
                                <X size={16} />
                              </button>
                            </div>
                            <div className={styles.editGrid}>
                              <div className={styles.editField}>
                                <label>Name</label>
                                {textField('name')}
                              </div>
                              <div className={styles.editField}>
                                <label>Model</label>
                                {textField('model')}
                              </div>
                              <div className={styles.editField}>
                                <label>Year</label>
                                {textField('year', 'number', { min: 1990, max: 2030 })}
                              </div>
                              <div className={styles.editField}>
                                <label>Price ($)</label>
                                {textField('price', 'number', { min: 0 })}
                              </div>
                              <div className={styles.editField}>
                                <label>Stock</label>
                                {textField('stock', 'number', { min: 0 })}
                              </div>
                              <div className={styles.editField}>
                                <label>Max Stock</label>
                                {textField('maxStock', 'number', { min: 0 })}
                              </div>
                              <div className={styles.editField}>
                                <label>Horsepower</label>
                                {textField('horsepower', 'number', { min: 0 })}
                              </div>
                              <div className={styles.editField}>
                                <label>Category</label>
                                {selectField('category', CATEGORIES)}
                              </div>
                              <div className={styles.editField}>
                                <label>Fuel</label>
                                {selectField('fuel', FUELS)}
                              </div>
                              <div className={styles.editField}>
                                <label>Transmission</label>
                                {selectField('transmission', TRANSMISSIONS)}
                              </div>
                              <div className={styles.editField}>
                                <label>Acceleration</label>
                                {textField('acceleration')}
                              </div>
                              <div className={styles.editFieldCheck}>
                                <label>Featured</label>
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
                                  checked={!!editForm.featured}
                                  onChange={(e) =>
                                    setEditForm((f) => ({ ...f, featured: e.target.checked }))
                                  }
                                />
                              </div>
                              <div className={`${styles.editField} ${styles.fullWidthField}`}>
                                <label>Image File</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className={styles.editInput} 
                                  onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setEditForm((f) => ({ ...f, image: reader.result }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }} 
                                />
                                {editForm.image && (
                                  <img src={editForm.image} alt="Preview" className={styles.previewThumb} />
                                )}
                              </div>
                            </div>
                            <div className={styles.editActions}>
                              <motion.button
                                className={styles.saveBtn}
                                onClick={() => handleSave(vehicle)}
                                disabled={saving}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <Save size={15} />
                                {saving ? 'Saving...' : 'Save Changes'}
                              </motion.button>
                              <button className={styles.cancelBtn} onClick={cancelEdit}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      <motion.tr
                        key="row"
                        className={`${styles.row} ${isDeleting ? styles.deletingRow : ''}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                      >
                        {/* Vehicle */}
                        <td>
                          <div className={styles.vehicleCell}>
                            {vehicle.image && (
                              <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                className={styles.thumb}
                              />
                            )}
                            <div className={styles.vehicleInfo}>
                              <span className={styles.vehicleName}>{vehicle.name}</span>
                              <span className={styles.vehicleSub}>
                                {vehicle.model} · {vehicle.year}
                              </span>
                              {tags.length > 0 && (
                                <div className={styles.tagRow}>
                                  {tags.slice(0, 2).map((t) => (
                                    <span key={t} className={styles.tag}>{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={styles.categoryBadge}>{vehicle.category}</span>
                        </td>

                        <td className={styles.price}>
                          ${Number(vehicle.price).toLocaleString()}
                        </td>

                        <td>
                          <div className={styles.stockCell}>
                            <span
                              className={`${styles.stockNum} ${
                                vehicle.stock === 0
                                  ? styles.stockZero
                                  : vehicle.stock <= 3
                                  ? styles.stockLow
                                  : ''
                              }`}
                            >
                              {vehicle.stock}
                            </span>
                            <div className={styles.stockBar}>
                              <div
                                className={styles.stockFill}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (((vehicle.stock ?? 0) / (vehicle.maxStock || 1)) * 100)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className={styles.hp}>
                          {vehicle.horsepower} <span>hp</span>
                        </td>

                        <td className={styles.fuel}>{vehicle.fuel}</td>

                        <td>
                          {isDeleting ? (
                            <div className={styles.deleteConfirm}>
                              <AlertTriangle size={14} className={styles.warnIcon} />
                              <span>Delete?</span>
                              <motion.button
                                className={styles.confirmDeleteBtn}
                                onClick={() => handleDelete(vehicle.id)}
                                disabled={deleting}
                                whileTap={{ scale: 0.95 }}
                              >
                                {deleting ? '...' : 'Yes'}
                              </motion.button>
                              <button
                                className={styles.cancelSmallBtn}
                                onClick={() => setDeletingId(null)}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className={styles.actionBtns}>
                              <motion.button
                                className={styles.editBtn}
                                onClick={() => startEdit(vehicle)}
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                title="Edit vehicle"
                                id={`edit-vehicle-${vehicle.id}`}
                              >
                                <Edit3 size={15} />
                              </motion.button>
                              <motion.button
                                className={styles.deleteBtn}
                                onClick={() => setDeletingId(vehicle.id)}
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                title="Delete vehicle"
                                id={`delete-vehicle-${vehicle.id}`}
                              >
                                <Trash2 size={15} />
                              </motion.button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
