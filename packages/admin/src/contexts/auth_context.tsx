import * as React from 'react';
import { navigate } from 'gatsby';
import { setUserInfo as loginSetUserInfo, getUserInfo } from '../api/login';
import { LoginAsyncStorage, LOGIN_KEY_INITIAL } from '../api/api';
import socketIOClient from 'socket.io-client';

const socket_url = process.env.GATSBY_API_SOCKET_URL || 'http://localhost:3000';
const MESSAGE_KEY = 'new_order';

interface AuthContextInterface extends Partial<Omit<LoginAsyncStorage, 'accessToken'>> {
  isLoading?: boolean;
  isLogged?: boolean;
  setUserInfo?: (d: LoginAsyncStorage) => void;
  signOutUser?: () => void;
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
  const socketRef = React.useRef(null);

  const setUserInfo = React.useCallback((d: LoginAsyncStorage) => {
    loginSetUserInfo(d);
    setIsLogged(true);
    setRole(d.role);
    setUserId(d.userId);
  }, []);

  const signOutUser = React.useCallback(() => {
    loginSetUserInfo(LOGIN_KEY_INITIAL);
    setIsLogged(false);
    setRole(null);
    setUserId(null);
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

  React.useEffect(() => {
    if (isLogged) {
      const socket = socketIOClient(`${socket_url}/admin`);
      socketRef.current = socket;
      socket.connect();

      socket.on(MESSAGE_KEY, (received) =>
        alert(`Pedido #${received} recebido!`),
      );

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          return socket.connect();
        }
      });
    } else if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isLogged]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogged,
        role,
        setUserInfo,
        signOutUser,
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
