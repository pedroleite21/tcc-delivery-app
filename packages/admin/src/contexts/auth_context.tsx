import * as React from 'react';
import { navigate } from 'gatsby';
import { getUserInfo } from '../api/login';

type AuthContextProps = {
  isLoading?: boolean;
  isLogged?: boolean;
  userId?: string;
}

export const AuthContext = React.createContext<AuthContextProps>({});

type AuthContextProviderProps = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLogged, setIsLogged] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    const value = getUserInfo();
    setIsLoading(false);
    if (value.accessToken) {
      setIsLogged(true);
      setIsLoading(false);
      // navigate('/admin/home');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogged,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return React.useContext(AuthContext);
}