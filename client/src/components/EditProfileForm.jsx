import React, { useState } from "react";
import styled from "styled-components";

// Główna sekcja formularza
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

// Grupa pola
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Etykieta pola
const Label = styled.label`
  font-weight: 600;
  color: #1e293b; // slate-800
  font-size: 0.95rem;
`;

// Pole tekstowe
const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0; // slate-200
  border-radius: 0.75rem;
  background-color: #f8fafc; // slate-50
  font-size: 1rem;
  color: #0f172a; // slate-900
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0ea5e9; // sky-500
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
    background-color: #fff;
  }

  &::placeholder {
    color: #94a3b8; // slate-400
  }
`;

// Przyciski akcji
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background-color: #fff;
  color: #475569; // slate-600
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9; // slate-100
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  background-color: #0ea5e9; // sky-500
  color: #fff;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #0284c7; // sky-600
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const EditProfileForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Imię i nazwisko</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jan Kowalski"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Licencja</Label>
        <Input
          name="license"
          value={formData.license}
          onChange={handleChange}
          placeholder="np. ABC123"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>ID pilota</Label>
        <Input
          name="pilotId"
          value={formData.pilotId}
          onChange={handleChange}
          placeholder="np. PILOT001"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Baza domowa</Label>
        <Input
          name="homeBase"
          value={formData.homeBase}
          onChange={handleChange}
          placeholder="Warszawa"
        />
      </FormGroup>

      <Actions>
        <CancelButton type="button" onClick={() => onSave(null)}>
          Anuluj
        </CancelButton>
        <SaveButton type="submit">Zapisz zmiany</SaveButton>
      </Actions>
    </Form>
  );
};
