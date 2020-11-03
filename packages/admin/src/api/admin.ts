import { AxiosResponse } from 'axios';
import api from './api';
import { getUserInfo } from './login';

export type ModeratorData = {
  name: string;
  email: string;
  password: string;
}

export async function addModerator(moderatorData: ModeratorData) {
  const { accessToken } = getUserInfo();

  const { data } = await api.post(
    `/auth/signup`,
    moderatorData,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

type ModeratorsResponse = Omit<ModeratorData, 'password'> & { id: string | number };

export async function getModerators() {
  const { accessToken } = getUserInfo();

  const { data } = await api.get<{}, AxiosResponse<ModeratorsResponse[]>>(
    `/auth/moderators`,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

export async function getRestaurantInfo() {
  const { accessToken } = getUserInfo();

  const { data } = await api.get(
    `/restaurant`,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}

export async function postRestaurantInfo(info) {
  const { accessToken } = getUserInfo();

  const { data } = await api.post(
    `/restaurant`,
    info,
    {
      headers: {
        'x-access-token': accessToken,
      }
    },
  );

  return data;
}
