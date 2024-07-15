import { Page, Question } from '@/types';
import axios from 'axios';
import qs from 'query-string';

export async function listQuestions({
  filter,
  pageNum,
  q,
}: {
  filter: string | null;
  pageNum: string | null;
  q: string | null;
}): Promise<Page<Question>> {
  const query = {
    filter: filter ? filter : 'recommended',
    pageNum: pageNum ? parseInt(pageNum as string) : 1,
    q: q ? q : null,
  };
  try {
    const url = qs.stringifyUrl({
      url: '/question/list',
      query: query,
    });
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function listQuestionsByUserId(
  userId: string,
  { pageNum }: { pageNum: string | null }
): Promise<Page<Question>> {
  try {
    const query = {
      userId,
      pageNum: pageNum ? parseInt(pageNum) : 1,
    };
    const url = qs.stringifyUrl({
      url: '/question/list/user',
      query: query,
    });
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getQuestionById(questionId: string): Promise<Question> {
  try {
    const { data } = await axios.get(`/question/${questionId}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function listSavedQuestions({
  filter,
  pageNum,
  q,
}: {
  filter: string | null;
  pageNum: string | null;
  q: string | null;
}): Promise<Page<Question>> {
  const query = {
    filter: filter ? filter : 'recommended',
    pageNum: pageNum ? parseInt(pageNum as string) : 1,
    q: q ? q : null,
  };
  const url = qs.stringifyUrl({
    url: '/question/list/saved-question',
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
export async function deleteQuestion(questionId: string): Promise<void> {
  try {
    await axios.delete(`/question/${questionId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
