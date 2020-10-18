import { AxiosResponse } from 'axios';
import api from './api';
import { getUserInfo } from './login';

type ProductResponse = {
  basePrice: string;
  categoryId: string | number;
  description: string;
  featured: boolean;
  id: string | number;
  name: string;
}

export async function getProduct(_, id: string | number) {
  const { accessToken } = getUserInfo();

  const { data } = await api.get<{}, AxiosResponse<ProductResponse>>(
    `/items/${id}`,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}