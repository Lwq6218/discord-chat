import axios from '@/services/axios-request';
import { Channel, Server } from '@/types';

export async function getServerById(id?: string): Promise<Server> {
  try {
    const { data } = await axios.get(`/server/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getInitialChannelById(id?: string): Promise<Channel> {
  try {
    const { data } = await axios.get(`/server/initial-channel/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getServerByInviteCode(
  inviteCode?: string
): Promise<Server> {
  try {
    const { data } = await axios.get(`/server/invite/${inviteCode}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function listServers(): Promise<Server[]> {
  try {
    const { data } = await axios.get(`/server/list`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
