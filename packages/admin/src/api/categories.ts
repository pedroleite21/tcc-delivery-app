import { AxiosResponse } from 'axios';
import api from './api';
import { getUserInfo } from './login';

type DefaultCategoryType = {
  id: string | number;
  name: string;
}

export async function getCategories() {
  const { accessToken } = getUserInfo();

  const { data } = await api.get<{}, AxiosResponse<DefaultCategoryType[]>>('/categories', {
    headers: {
      'x-access-token': accessToken,
    }
  });

  return data;
}

export async function getCategory(_, id: string | number) {
  const { accessToken } = getUserInfo();

  const { data } = await api.get<{}, AxiosResponse<DefaultCategoryType>>(
    `/categories/${id}`,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

export async function getCategoryItems(_, id: string | number) {
  const { accessToken } = getUserInfo();

  const { data } = await api.get<{}, AxiosResponse<DefaultCategoryType[]>>(
    `/categories/${id}/items`,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

export async function updateCategoryName({ id, ...rest }: DefaultCategoryType) {
  const { accessToken } = getUserInfo();

  return await api.put(
    `/categories/${id}`,
    rest,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );
}

export async function createCategory(data: Omit<DefaultCategoryType, 'id'>) {
  const { accessToken } = getUserInfo();

  return await api.post(
    `/categories`,
    data,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );
}
