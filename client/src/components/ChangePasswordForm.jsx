import React, { useState } from "react";
import styled from "styled-components";

// Kontener formularza
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

// Sekcja pola
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Etykieta
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

// Przycisk zapisu
const SaveButton = styled.button`
  background-color: #0ea5e9; // sky-500
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.875rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #0284c7; // sky-600
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Komunikat błędu
const ErrorMessage = styled.p`
  color: #dc2626; // red-600
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

export const ChangePasswordForm = ({ onSave }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Nowe hasła nie są identyczne.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setError("");
    onSave?.({
      currentPassword,
      newPassword,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Aktualne hasło</Label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Wpisz aktualne hasło"
        />
      </FormGroup>

      <FormGroup>
        <Label>Nowe hasło</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Wpisz nowe hasło"
        />
      </FormGroup>

      <FormGroup>
        <Label>Potwierdź nowe hasło</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Powtórz nowe hasło"
        />
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SaveButton type="submit">Zapisz nowe hasło</SaveButton>
    </Form>
  );
};
