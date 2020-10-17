import { AxiosResponse } from 'axios';
import api, { LOGIN_KEY, LOGIN_KEY_INITIAL, LoginAsyncStorage } from './api';

export function getUserInfo(): LoginAsyncStorage {
  try {
    const item = window.localStorage.getItem(LOGIN_KEY);
    return item ? JSON.parse(item) : LOGIN_KEY_INITIAL;
  } catch (error) {
    console.error(error);
    return LOGIN_KEY_INITIAL;
  }
}

export function setUserInfo(value: LoginAsyncStorage) {
  try {
    window.localStorage.setItem(LOGIN_KEY, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

type SignInProps = {
  email: string;
  password: string;
}
type SignInResponse = {
  accessToken: string;
  email: string;
  id: string;
  role: 'admin' | 'moderator';
}

export async function signIn(data: SignInProps) {
  return await api.post<SignInProps, AxiosResponse<SignInResponse>>('/auth/signin', data);
}
