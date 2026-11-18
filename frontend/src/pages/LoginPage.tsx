import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from './LandingPage';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LandingPage
      initialAuthModalOpen={true}
      initialAuthModalMode="login"
      onModalClose={() => navigate('/')}
    />
  );
};

export default LoginPage;