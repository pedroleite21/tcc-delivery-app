import axios, { AxiosResponse } from 'axios';
import { getUserInfo, setUserInfo } from './login';

export type LoginAsyncStorage = {
  accessToken: string | null;
  role: 'admin' | 'moderator' | null;
  userId: number | string | null;
}

export const LOGIN_KEY = '@EasyDelivery:login-token-api';
export const LOGIN_KEY_INITIAL = {
  accessToken: null,
  role: null,
  userId: null,
};

const api = axios.create({
  baseURL: process.env.GATSBY_API_URL || 'http://localhost:3000/api',
});

type RefreshTokenResponse = {
  accessToken: string;
  id: string | number;
};

async function refreshToken(id: string | number) {
  const { data } = await api.post<{}, AxiosResponse<RefreshTokenResponse>>(
    '/auth/refreshtoken',
    { id }
  );

  return data;
}

let isRefreshing = false;
api.interceptors.response
  .use(
    (response) => response,
    async (error) => {
      const {
        config: originalRequest,
        response: { status },
      } = error;

      if (status === 401) {
        let data: RefreshTokenResponse;

        const { userId, role } = getUserInfo();

        if(!isRefreshing) {
          isRefreshing = true;
          data = await refreshToken(userId);
          setUserInfo({
            accessToken: data.accessToken,
            role,
            userId,
          });
          isRefreshing = false;
        }

        return new Promise((resolve) => {
          originalRequest.headers['x-access-token'] = data.accessToken;
          resolve(axios(originalRequest));
        });
      } else {
        return Promise.reject(error);
      }
    }
  );

export default api;

