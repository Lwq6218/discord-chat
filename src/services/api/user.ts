import { Page, Profile } from '@/types';
import axios from 'axios';
import qs from 'query-string';

export async function listUsers({
  filter,
  pageNum,
  q,
}: {
  filter: string | null;
  pageNum: string | null;
  q: string | null;
}): Promise<Page<Profile>> {
  const query = {
    filter: filter ? filter : 'recommended',
    pageNum: pageNum ? parseInt(pageNum as string) : 1,
    q: q ? q : null,
    // pageSize: parseInt('4'),
  };
  const url = qs.stringifyUrl({
    url: '/user/list',
    query: query,
  });
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserById(id: string): Promise<Profile> {
  try {
    const { data } = await axios.get(`/user/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
