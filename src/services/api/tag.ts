import { Page, Tag } from '@/types';
import qs from 'query-string';
import axios from 'axios';

export async function listTags({
  filter,
  pageNum,
  q,
}: {
  filter: string | null;
  pageNum: string | null;
  q: string | null;
}): Promise<Page<Tag>> {
  const query = {
    filter: filter ? filter : 'recommended',
    pageNum: pageNum ? parseInt(pageNum as string) : 1,
    q: q ? q : null,
  };

  const url = qs.stringifyUrl({
    url: '/tag/list',
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
