import axios from 'axios';

export type LoginAsyncStorage = {
  accessToken: string | null;
  role: string | null;
  userId: number | string | null;
}

export const LOGIN_KEY = '@EasyDelivery:login-token-api';
export const LOGIN_KEY_INITIAL = {
  accessToken: null,
  role: null,
  userId: null,
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// let isRefreshing = false;
// api.interceptors.response
//   .use(
//     (response) => response,
//     async (error) => {
//       const {
//         config: originalRequest,
//         response: { data: { status_code } },
//       } = error;



//     }
//   )

export default api;

