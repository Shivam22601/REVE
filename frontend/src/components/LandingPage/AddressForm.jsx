import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const empty = {
  label: '',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  isDefault: false
};

const AddressForm = ({ initial = empty, onCancel, onSave }) => {
  const [form, setForm] = useState(initial);

  useEffect(() => setForm(initial), [initial]);

  const handleChange = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [k]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic client-side validation
    if (!form.line1 || !form.city || !form.country) {
      toast.error('Please fill required fields: Address, City, Country');
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <div>
        <label className="text-sm">Label (Home / Office)</label>
        <input value={form.label} onChange={handleChange('label')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="text-sm">Name</label>
        <input value={form.name} onChange={handleChange('name')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="text-sm">Phone</label>
        <input value={form.phone} onChange={handleChange('phone')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="text-sm">Address line 1 *</label>
        <input value={form.line1} onChange={handleChange('line1')} className="w-full p-2 border rounded" required />
      </div>
      <div>
        <label className="text-sm">Address line 2</label>
        <input value={form.line2} onChange={handleChange('line2')} className="w-full p-2 border rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">City *</label>
          <input value={form.city} onChange={handleChange('city')} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="text-sm">State</label>
          <input value={form.state} onChange={handleChange('state')} className="w-full p-2 border rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Zip</label>
          <input value={form.zip} onChange={handleChange('zip')} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm">Country *</label>
          <input value={form.country} onChange={handleChange('country')} className="w-full p-2 border rounded" required />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.isDefault} onChange={handleChange('isDefault')} />
        <label className="text-sm">Set as default</label>
      </div>

      <div className="flex gap-3 mt-3">
        <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
};

export default AddressForm;
