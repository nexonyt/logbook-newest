import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "./Icon"; // Twój komponent ikon
import { EditProfileForm } from "./EditProfileForm";

// Styled-components
const Section = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155; // slate-700
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #e2e8f0; // slate-100
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f8fafc; // slate-50
  }
`;

const ActionContent = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  background-color: #e0f2fe; // sky-100
  color: #0ea5e9; // sky-600
  padding: 0.75rem;
  border-radius: 9999px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionText = styled.div`
  text-align: left;

  p:first-child {
    font-weight: 600;
    color: #1e293b; // slate-800
  }

  p:last-child {
    font-size: 0.875rem;
    color: #64748b; // slate-500
    display: none;

    @media (min-width: 640px) {
      display: block;
    }
  }
`;

const ArrowIcon = styled(Icon)`
  width: 1.25rem;
  height: 1.25rem;
  color: #94a3b8; // slate-400
`;

// Modal ogólny
const ModalWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75); // slate-900/75%
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 2rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  font-weight: 700;
  font-size: 1.25rem;
  color: #1e293b;
`;

const CloseButton = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  color: #64748b;
  background: transparent;
  transition: 0.2s;
  &:hover {
    background: #f1f5f9;
    color: #0ea5e9;
  }
`;

// Komponent Modala specyficzny dla akcji
const GenericModal = ({ title, children, onClose }) => (
  <ModalWrapper>
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <CloseButton onClick={onClose}>
          <Icon name="x" className="w-6 h-6" />
        </CloseButton>
      </ModalHeader>
      {children}
    </ModalContent>
  </ModalWrapper>
);

// Sekcja Ustawień w App
const SettingsSection = () => {
  const [modal, setModal] = useState(null); // null | 'profile' | 'password' | 'subscription'

    // Dodaj stan dla profilu
  const [profile, setProfile] = useState({
    name: "Jan Kowalski",
    license: "ABC123",
    pilotId: "PILOT001",
    homeBase: "Warszawa",
  });

  return (
    <Section>
      <SectionTitle>Ustawienia i bezpieczeństwo</SectionTitle>

      <ActionButton onClick={() => setModal("profile")}>
        <ActionContent>
          <IconWrapper>
            <Icon name="user" className="w-6 h-6" />
          </IconWrapper>
          <ActionText>
            <p>Edytuj dane profilowe</p>
            <p>Zaktualizuj swoje imię, nazwisko, licencję i bazę domową.</p>
          </ActionText>
        </ActionContent>
        <ArrowIcon name="arrow-right" />
      </ActionButton>

      <ActionButton onClick={() => setModal("password")}>
        <ActionContent>
          <IconWrapper>
            <Icon name="key" className="w-6 h-6" />
          </IconWrapper>
          <ActionText>
            <p>Zmień hasło</p>
            <p>Użyj silnego hasła, aby zabezpieczyć swoje konto.</p>
          </ActionText>
        </ActionContent>
        <ArrowIcon name="arrow-right" />
      </ActionButton>

      <ActionButton onClick={() => setModal("subscription")}>
        <ActionContent>
          <IconWrapper>
            <Icon name="settings" className="w-6 h-6" />
          </IconWrapper>
          <ActionText>
            <p>Zarządzaj subskrypcją</p>
            <p>Przejrzyj swój plan, faktury i opcje płatności.</p>
          </ActionText>
        </ActionContent>
        <ArrowIcon name="arrow-right" />
      </ActionButton>

      {/* Renderowanie modali */}
      {modal === "profile" && (
        <GenericModal
          title="Edytuj dane profilowe"
          onClose={() => setModal(null)}
        >
          <EditProfileForm
            profile={profile}
            onSave={(updatedData) => {
              if (updatedData) setProfile(updatedData); // zapisujemy zmiany
              setModal(null); // zamykamy modal
            }}
          />
        </GenericModal>
      )}

      {modal === "password" && (
        <GenericModal title="Zmień hasło" onClose={() => setModal(null)}>
          <p>Tu wstaw formularz zmiany hasła</p>
        </GenericModal>
      )}

      {modal === "subscription" && (
        <GenericModal
          title="Zarządzaj subskrypcją"
          onClose={() => setModal(null)}
        >
          <p>Tu wstaw formularz zarządzania subskrypcją</p>
        </GenericModal>
      )}
    </Section>
  );
};

export default SettingsSection;
