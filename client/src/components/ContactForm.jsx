import React, { useState } from "react";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  ButtonPrimary,
  ButtonSecondary,
} from "./FormStyles";

export const ContactForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Kontakt z administratorem</h2>
      <p className="description">
        Wypełnij poniższy formularz, jeśli napotkałeś problem z aplikacją.
      </p>

      <FormGroup>
        <Label>Temat wiadomości</Label>
        <Input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Np. Problem z logowaniem"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Opis problemu</Label>
        <TextArea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="Opisz szczegóły problemu..."
          required
        />
      </FormGroup>

      <ButtonGroup>
        <ButtonSecondary type="button" onClick={onCancel}>
          Anuluj
        </ButtonSecondary>
        <ButtonPrimary type="submit">Wyślij wiadomość</ButtonPrimary>
      </ButtonGroup>
    </FormContainer>
  );
};
