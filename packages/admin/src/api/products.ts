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
  image?: string | null;
  name: string;
  options?: ProductOption[];
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

interface AddProductInterface extends Omit<ProductResponse, 'id' | 'options'> {
  itemOptions?: ProductOption[];
}
type AddProductProps = AddProductInterface;

export async function addProduct(data: AddProductProps) {
  const { accessToken } = getUserInfo();

  return await api.post(
    '/items',
    data,
    {
      headers: {
        'x-access-token': accessToken,
      }
    }
  )
}

type UploadImageResponse = {
  imageUrl: string;
  message: string;
  success: boolean;
}

export async function uploadImage(file: File[] | string) {
  const { accessToken } = getUserInfo();

  if (!file || typeof file === 'string' || file.length === 0) return;

  const formData = new FormData();
  formData.append('image', file[0]);

  const { data } = await api.post<{}, AxiosResponse<UploadImageResponse>>(
    '/upload',
    formData,
    {
      headers: {
        'content-type': 'multipart/form-data',
        'x-access-token': accessToken,
      },
    },
  );

  return data;
}