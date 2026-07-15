import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2, Package, RefreshCw } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import styles from '../../styles/ui/AdminVehicleForm.module.css';

const EMPTY_VEHICLE = {
  name: '',
  model: '',
  category: 'Coupe',
  year: 2024,
  price: 0,
  horsepower: 0,
  torque: 0,
  transmission: 'Automatic',
  fuel: 'Gasoline',
  acceleration: '',
  topSpeed: '',
  color: '',
  stock: 5,
  image: '',
  tags: [],
  description: '',
  featured: false,
};

const CATEGORIES = ['Sedan', 'Coupe', 'SUV', 'Sports', 'Electric', 'Luxury'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'DCT'];
const FUELS = ['Gasoline', 'Electric', 'Hybrid', 'Diesel'];

export default function AdminVehicleForm({ mode = 'add', vehicle = null, onClose }) {
  const { addVehicle, updateVehicle, deleteVehicle, restockVehicle } = useApp();
  const [form, setForm] = useState(vehicle || EMPTY_VEHICLE);
  const [restockAmount, setRestockAmount] = useState(5);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    setForm(vehicle || EMPTY_VEHICLE);
  }, [vehicle]);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    const formattedForm = {
      ...form,
      tags: Array.isArray(form.tags) ? form.tags.join(',') : form.tags
    };

    if (mode === 'add') {
      result = await addVehicle({ ...formattedForm, maxStock: formattedForm.stock });
    } else {
      result = await updateVehicle(formattedForm);
    }
    if (result && result.success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!vehicle) return;
    if (window.confirm(`Delete ${vehicle.name}? This cannot be undone.`)) {
      const result = await deleteVehicle(vehicle.id);
      if (result && result.success) {
        onClose();
      }
    }
  };

  const handleRestock = async () => {
    if (!vehicle) return;
    const result = await restockVehicle(vehicle.id, restockAmount);
    if (result && result.success) {
      onClose();
    }
  };

  return (
    <motion.div
      className={styles.formContainer}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
    >
      <div className={styles.formHeader}>
        <div>
          <h3 className={styles.formTitle}>
            {mode === 'add' ? 'Add Vehicle' : mode === 'edit' ? 'Edit Vehicle' : 'Restock'}
          </h3>
          <p className={styles.formSubtitle}>
            {mode === 'add' ? 'Add a new vehicle to inventory' :
              mode === 'edit' ? `Editing: ${vehicle?.name}` : `Restocking: ${vehicle?.name}`}
          </p>
        </div>
        <button className={styles.closeFormBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      {mode === 'restock' && (
        <div className={styles.restockPanel}>
          <Package size={40} className={styles.restockIcon} />
          <p className={styles.restockLabel}>Add units to stock</p>
          <div className={styles.restockControls}>
            <input
              type="number"
              min="1"
              max="50"
              value={restockAmount}
              onChange={e => setRestockAmount(Number(e.target.value))}
              className={styles.restockInput}
              id="restock-amount"
            />
            <button className="btn btn-accent" onClick={handleRestock}>
              <RefreshCw size={16} />
              Restock
            </button>
          </div>
          <p className={styles.restockCurrentStock}>Current: {vehicle?.stock} / {vehicle?.maxStock}</p>
        </div>
      )}
      {(mode === 'add' || mode === 'edit') && (
        <form className={styles.form} onSubmit={handleSubmit} id="vehicle-form">
          {/* Tabs */}
          <div className={styles.tabs}>
            {['basic', 'specs', 'media'].map(tab => (
              <button
                key={tab}
                type="button"
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {activeTab === 'basic' && (
            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Vehicle Name</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Add car name"
                  required
                  id="field-name"
                />
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Model</label>
                  <input className={styles.input} value={form.model} onChange={e => update('model', e.target.value)} placeholder="Model" required id="field-model" />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Year</label>
                  <input className={styles.input} type="number" value={form.year} onChange={e => update('year', Number(e.target.value))} min="2020" max="2030" id="field-year" />
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Category</label>
                  <select className={styles.input} value={form.category} onChange={e => update('category', e.target.value)} id="field-category">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Color</label>
                  <input className={styles.input} value={form.color} onChange={e => update('color', e.target.value)} placeholder="Frozen Black Metallic" id="field-color" />
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Price (USD)</label>
                  <input className={styles.input} type="number" value={form.price} onChange={e => update('price', Number(e.target.value))} min="0" step="100" id="field-price" />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Stock</label>
                  <input className={styles.input} type="number" value={form.stock} onChange={e => update('stock', Number(e.target.value))} min="0" id="field-stock" />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={e => update('description', e.target.value)} rows={3} id="field-description" />
              </div>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} id="field-featured" />
                Featured vehicle
              </label>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className={styles.fields}>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Horsepower</label>
                  <input className={styles.input} type="number" value={form.horsepower} onChange={e => update('horsepower', Number(e.target.value))} id="field-horsepower" />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Torque (lb-ft)</label>
                  <input className={styles.input} type="number" value={form.torque} onChange={e => update('torque', Number(e.target.value))} id="field-torque" />
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Transmission</label>
                  <select className={styles.input} value={form.transmission} onChange={e => update('transmission', e.target.value)} id="field-transmission">
                    {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Fuel Type</label>
                  <select className={styles.input} value={form.fuel} onChange={e => update('fuel', e.target.value)} id="field-fuel">
                    {FUELS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>0-60 mph</label>
                  <input className={styles.input} value={form.acceleration} onChange={e => update('acceleration', e.target.value)} placeholder="3.8s 0-60mph" id="field-acceleration" />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Top Speed</label>
                  <input className={styles.input} value={form.topSpeed} onChange={e => update('topSpeed', e.target.value)} placeholder="180 mph" id="field-topspeed" />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'media' && (
            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        update('image', reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  id="field-image-upload"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Or Image URL</label>
                <input className={styles.input} value={form.image} onChange={e => update('image', e.target.value)} placeholder="https://..." id="field-image" />
              </div>
              {form.image && (
                <div className={styles.imagePreview}>
                  <img src={form.image} alt="Preview" className={styles.previewImg} />
                </div>
              )}
            </div>
          )}
          <div className={styles.formActions}>
            {mode === 'edit' && (
              <button type="button" className={`btn ${styles.deleteBtn}`} onClick={handleDelete} id="delete-vehicle-btn">
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <button type="submit" className="btn btn-primary" id="save-vehicle-btn">
              <Save size={16} />
              {mode === 'add' ? 'Add Vehicle' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
