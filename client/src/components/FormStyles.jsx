import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
    color: #222;
  }

  .description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #444;
  margin-bottom: 0.4rem;
`;

export const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 0.95rem;
  transition: border 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 0.95rem;
  resize: vertical;
  transition: border 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1rem;
`;

export const ButtonPrimary = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #0066d1;
  }
`;

export const ButtonSecondary = styled.button`
  background-color: transparent;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;
