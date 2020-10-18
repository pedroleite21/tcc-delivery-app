import * as React from 'react';
import { navigate } from 'gatsby';
import { setUserInfo as loginSetUserInfo, getUserInfo } from '../api/login';
import { LoginAsyncStorage } from '../api/api';

interface AuthContextInterface extends Partial<Omit<LoginAsyncStorage, 'accessToken'>> {
  isLoading?: boolean;
  isLogged?: boolean;
  setUserInfo?: (d: LoginAsyncStorage) => void;
}

type AuthContextProps = AuthContextInterface;

export const AuthContext = React.createContext<AuthContextProps>({});

type AuthContextProviderProps = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLogged, setIsLogged] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<string | null | number>(null);
  const [role, setRole] = React.useState<'admin' | 'moderator' | null>(null);

  const setUserInfo = React.useCallback((d: LoginAsyncStorage) => {
    loginSetUserInfo(d);
    setIsLogged(true);
    setRole(d.role);
    setUserId(d.userId);
  }, []);

  React.useLayoutEffect(() => {
    const value = getUserInfo();
    setIsLoading(false);
    if (value.accessToken) {
      setIsLoading(false);
      setIsLogged(true);
      setRole(value.role);
      setUserId(value.userId);
      navigate('/admin/home');
    }
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogged,
        role,
        setUserInfo,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return React.useContext(AuthContext);
}