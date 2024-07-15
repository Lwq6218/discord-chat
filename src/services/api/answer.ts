import { Answer, Page } from '@/types';
import axios from 'axios';
import qs from 'query-string';

export async function listAnswers(questionId: string): Promise<Page<Answer>> {
  try {
    const url = qs.stringifyUrl({
      url: `/answer/list/question`,
      query: { questionId },
    });
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function listAnswersByUserId(
  userId: string,
  { pageNum }: { pageNum: string | null }
): Promise<Page<Answer>> {
  const query = {
    userId,
    pageNum: pageNum ? parseInt(pageNum) : 1,
  };
  const url = qs.stringifyUrl({
    url: `/answer/list/user`,
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
export async function deleteAnswer(answerId: string): Promise<void> {
  try {
    await axios.delete(`/answer/${answerId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
