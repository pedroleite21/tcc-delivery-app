import { AxiosResponse } from 'axios';
import api from './api';
import { getUserInfo } from './login';

export type Order = {
  createdAt: string;
  id: string | number;
  status: string;
}

type TodaysOrdersResponse = {
  count: number;
  rows?: Order[];
};

export async function getTodaysOrders() {
  const { accessToken } = getUserInfo();

  const { data } = await api.get<{}, AxiosResponse<TodaysOrdersResponse>>(
    '/orders/history/today',
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

export async function getOrders(_, query) {
  const { accessToken } = getUserInfo();

  const { data } = await api.get(
    '/orders',
    {
      params: query,
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

export async function getOngoingOrders() {
  const { accessToken } = getUserInfo();

  const { data } = await api.get<{}, AxiosResponse<Order[]>>(
    '/orders/history/ongoing',
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

export async function updateOrderStatus({ status, id }) {
  const { accessToken } = getUserInfo();

  return await api.put(
    `/orders/status/${id}`,
    { status },
    {
      headers: {
        'x-access-token': accessToken,
      },
    },
  );
}
