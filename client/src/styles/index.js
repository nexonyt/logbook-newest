import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0b0f19;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%);
    top: -200px;
    left: -200px;
    z-index: 1;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0) 70%);
    bottom: -200px;
    right: -200px;
    z-index: 1;
    pointer-events: none;
  }
`;

export const ContainerLogin = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 25px;
  flex-direction: column;
  background-color: rgb(123, 54, 244);
  padding: 10px;
`;

export const ContainerRegister = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 25px;
  flex-direction: column;
  background-color: rgb(123, 54, 244);
  padding: 10px;
`;

export const LoggedArea = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const LoggedAreaText = styled.div`
  width: 50%;
  display: flex;
  gap: 10px;
`;

export const ButtonLogoutArea = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonLogout = styled(Link)`
  text-decoration: none;
  color: black;
  width: 30%;
  background-color: white;
  font-size: 12px;
  border-radius: 15px;
  text-align: center;
  padding: 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoginArea = styled.div`
  width: 85%;
  height: 320px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 2px solid black;
  border-radius: 25px;
  gap: 10px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  svg {
    position: absolute;
    left: 1rem;
    color: #64748b;
    transition: color 0.3s ease;
    pointer-events: none;
    z-index: 5;
  }

  &:focus-within svg {
    color: #60a5fa;
  }
`;

export const InputArea = styled.input`
  color: #f8fafc;
  width: 100%;
  height: 48px;
  border-radius: 12px;
  padding: 0 1rem 0 3rem;
  outline: none;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #60a5fa;
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const InputAreaForRegister = InputArea;

export const ButtonLink = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
    background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const LoggedContainer = styled.div`
  width: 80%;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
`;

export const NewLoginArea = styled.div`
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  box-sizing: border-box;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  z-index: 10;

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
`;

export const NewRegisterArea = styled.div`
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  z-index: 10;

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }

  @media (max-width: 600px) {
    padding: 2rem 1.5rem;
  }
`;

export const AddFlightsDivRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.25rem 0;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const DivForInputs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const HaveNotAccount = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  transition: color 0.2s ease;
  text-decoration: none;

  p {
    margin: 0;
  }

  &:hover {
    cursor: pointer;
    color: #60a5fa;
  }
`;

export const CheckboxField = styled.div`
  font-size: 14px;
  color: #94a3b8;
  margin-top: 0.75rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const CheckboxMark = styled.div`
`;

export const DashboardContent = styled.div`
  display: flex;
  height: 100vh;
  overflow-y: auto;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

