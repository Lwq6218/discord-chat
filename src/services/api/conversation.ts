import axios from '@/services/axios-request';
import { Conversation } from '@/types';

export async function getOrCreateConversation(
  memberOneId?: string,
  memberTwoId?: string
): Promise<Conversation> {
  try {
    const { data } = await axios.post('/conversation', {
      memberOneId,
      memberTwoId,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
