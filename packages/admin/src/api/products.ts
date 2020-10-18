import { AxiosResponse } from 'axios';
import api from './api';
import { getUserInfo } from './login';

export type OptionItems = {
  addPrice: string;
  id: string | number;
  name: string;
  paused: boolean;
}

export type ProductOption = {
  id: string | number;
  items: OptionItems[];
  maxItems: number | null;
  minItems: number | null;
  name: string;
  required: boolean;
  type: 'single' | 'multiple' | 'range';
}

type ProductResponse = {
  basePrice: string;
  categoryId: string | number;
  description: string;
  featured: boolean;
  id: string | number;
  name: string;
  options: ProductOption[];
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