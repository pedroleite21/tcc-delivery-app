import * as React from 'react';
import SplashPage from '../components/splash_page';
import { useAuthContext } from '../contexts/auth_context';

export default function Home() {
  const { isLoading } = useAuthContext();

  return <SplashPage show={isLoading} />;
}
