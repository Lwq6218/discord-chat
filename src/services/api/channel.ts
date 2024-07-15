import axios from '@/services/axios-request';
import { Channel } from '@/types';

export async function listChannelsByServerId(
  serverId?: string
): Promise<Channel[]> {
  try {
    const { data } = await axios.get(`/channel/list/${serverId}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getChannelById(channelId?: string): Promise<Channel> {
  try {
    const { data } = await axios.get(`/channel/${channelId}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
