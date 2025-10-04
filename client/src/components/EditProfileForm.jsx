import React, { useState } from 'react';

export const EditProfileForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Imię i nazwisko</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Licencja</label>
        <input
          name="license"
          value={formData.license}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ID pilota</label>
        <input
          name="pilotId"
          value={formData.pilotId}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Baza domowa</label>
        <input
          name="homeBase"
          value={formData.homeBase}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={() => onSave(null)} // albo zamknięcie modala
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Zapisz zmiany
        </button>
      </div>
    </form>
  );
};
